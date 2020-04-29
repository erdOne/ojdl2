var { spawnSync, execSync } = require("child_process");
var fs = require("fs");
var fsP = fs.promises;
import { SubDB, ProbDB } from "./databases.js";
import { Queue, spawnP, tryfork } from "./utils.js";
import { getComparator } from "./judge/comparators.js";
import { getTester } from "./judge/Tester.js";
import Judger from "./judge/Judger.js";
import Compiler from "./judge/Compiler.js";
import Uploader from "./judge/Uploader.js";
import { ErrorResult } from "./judge/results.js";

const workdir = "./workdir";
const isolatePath = "isolate/isolate";

import { sandbox } from "../../config.js";

global.sandBoxQueue = new Queue(sandbox.limit, function(boxno, callback) {
  boxno += sandbox.offset;

  try {
    tryfork(spawnSync(isolatePath, ["--init", "--cg", "-b", boxno]), "Sandbox");
  } catch (e) {
    tryfork(spawnSync(isolatePath, ["--cleanup", "--cg", "-b", boxno]), "Sandbox");
    tryfork(spawnSync(isolatePath, ["--init", "--cg", "-b", boxno]), "Sandbox");
  }

  return {
    boxExec(...args) {
      return spawnP(isolatePath, ["-b", boxno, ...args]);
    },
    boxClean() {
      return spawnP(isolatePath, ["--cleanup", "--cg", "-b", boxno]).finally(callback);
    }
  };
});

process.umask(0);

function getJid(sid) { return `${sid}_${new Date() % 1000}_${Math.floor(Math.random() * 1000)}`; }

async function init(sid) {
  var jid = getJid(sid);
  await fsP.mkdir(`${workdir}/${jid}`);
  var sub = await SubDB.findByPk(sid);
  if (!sub) throw ["Submission", 0, "submission doesn't exist."];
  tryfork(execSync(`install -m 777 data/prob/${sub.pid}/* ${workdir}/${jid}/`), "TestData");
  var compiler = new Compiler(sub.language);
  console.log("jizz");
  await compiler.compile(jid, sid);
  console.log(`Finished compiling of submission No. ${sid}.`);
  var prob = await ProbDB.findByPk(sub.pid, { logging: false });
  return { jid, sub, prob };
}

/* eslint-disable no-multi-spaces */
export async function exec(sid) {
  console.log(`Judging on submission No. ${sid}.`);
  var uploader = new Uploader(sid);
  try {
    var { jid, sub, prob } = await init(sid);

    var Comparator = getComparator(prob.testMethod), Tester = getTester(prob.testMethod),
      comparator   = new Comparator(prob.param),
      tester       = new Tester(sub.language),
      judger       = new Judger(tester, comparator, uploader);

    await judger.judge(jid, prob.testSuite);
  } catch (e) {
    console.error(e);
    await uploader.upload(new ErrorResult(e));
  }
  fs.rmdir(`${workdir}/${jid}`, { recursive: true },  console.error);
  console.log(`Finished judging on submission No. ${sid}.`);
}

export async function execUnlimited(sid) {
  throw "not implemented";
}
