// changeable
//

// var db = require("./mySQL.js");
var fs = require("fs");
// var { fork } = require("child_process");
import { UserDB, SubDB, ProbDB, ContDB, PostDB } from "./databases.js";
import { exec, execUnlimited } from "./exec.js";
import { hashUid, hashPswInDB, hashUidInDB } from "../client/common/hash.js";
import verdicts from "../client/common/verdicts.js";
import languages from "../client/common/languages.js";
import { toChars, fromChars } from "../client/common/char.js";
import sql, { Op } from "sequelize";

export async function getUser({ uid }) {
  var user = await UserDB.findOne({
    where: { uid: hashUidInDB(uid) }
  });
  if (!user) throw "no such user";
  return { user };
}

export async function isAdmin({ uid }) {
  var user = await UserDB.findOne({
    where: { uid: hashUidInDB(uid) },
    logging: false
  });
  return user !== null && user.admin;
}

export async function signUp({ handle, password }) {
  var uid = hashUid(handle, password);
  var [, created] = await UserDB.findOrCreate({
    where: { handle },
    defaults: {
      uid: hashUidInDB(uid),
      password: hashPswInDB(password)
    }
  });
  if (!created) throw "handle taken";
  return null;
}

export async function signIn({ handle, password }) {
  var user = await UserDB.findOne({
    where: { handle }
  });
  if (!user) throw "no such user";
  if (user.password !== hashPswInDB(password)) throw "wrong password";
  return { isAdmin: user.admin };
}

export async function signInUid({ uid }) {
  var user = await UserDB.findByPk(hashUidInDB(uid));
  if (!user) throw "no such user";
  return { isAdmin: user.admin };
}

const visibleSub = (cid = 0, admin) => ({
  model: ContDB.unscoped(),
  attributes: [],
  where: admin ? {} : {
    [Op.or]: [
      { visibility: "visible", cid, start: { [Op.lte]: new Date() } },
      { visibility: "hidden", end: { [Op.lte]: new Date() } }
    ]
  }
});

export async function getSub({ sid, uid, cid, withData }) {
  var admin = await isAdmin({ uid });
  var include = [visibleSub(cid, admin)];
  if (withData)
    include.push({
      model: ProbDB,
      attributes: ["title"]
    }, { model: UserDB, attributes: ["handle"] });
  var sub = await SubDB.findByPk(sid, { include, logging: withData });
  if (!sub) throw "no such sub";
  var file = { hasData: false };
  if (withData && (hashUidInDB(uid) === sub.uid || admin)) {
    file.hasData = true;
    file.data = fs.readFileSync(`./data/sub/${sid}`, { encoding: "utf-8" });
  }
  return { sub, file };
}

function visible(admin) {
  return admin ? {} : { visibility: "visible" };
}



export async function getConts({ uid }) {
  return { conts: await ContDB.findAll({ attributes: { exclude: ["problems"] },
    where: visible(await isAdmin({ uid }))
  }) };
}

export async function getCont({ uid, cid }) {
  var admin = await isAdmin({ uid });
  var cont = (await ContDB.findByPk(cid)).get({ plain: true });
  if (!cont) throw "no such contest";
  if (!admin && cont.visibility === "hidden")
    throw "you have no permission";
  if (cont.start > new Date() && !admin) {
    cont.problems = [];
    //cont.content = "";
    cont.visible = false;
  } else
    cont.visible = true;

  if (cont.problems.length > 0) {
    var probs = await ProbDB.findAll({
      where: { pid: { [Op.in]: cont.problems } }
    });
    for (let i in cont.problems) {
      cont.problems[i] = probs.find(e => e.pid === cont.problems[i]).get({ plain: true });
      cont.problems[i].ppid = cont.problems[i].pid;
      cont.problems[i].pid = toChars(i);
      if (!admin)
        delete cont.problems[i].difficulty;
    }
  }
  return { cont };
}

export async function getProbs({ uid, cid }) {
  if (!cid) {
    var probs = await ProbDB.findAll({
      attributes: ["pid", "title", "subtitle"],
      where: visible(await isAdmin({ uid }))
    });
    return { probs };
  }
  return { probs: (await getCont({ uid, cid })).cont.problems };
}

export async function getProb({ uid, pid, cid }) {
  var admin = isAdmin({ uid });
  if (!cid) {
    let prob = await ProbDB.findByPk(pid);
    if (prob.visibility === "hidden" && !admin)
      throw "you have no permission";
    if (!prob) throw "no such prob";
    return { prob };
  } else {
    let { cont } = await getCont({ uid, cid }),
      prob = cont.problems[fromChars(pid)];
    if (!prob) throw "no such prob";
    return { prob };
  }
}

const newSub = {
  result: {
    subtaskResult: [],
    score: 0,
    time: 0,
    memory: 0,
    verdict: verdicts.UN,
    pending: true
  },
  time: 0,
  memory: 0,
  verdict: verdicts.UN
};

function isCDOver(time) {
  if (!time || new Date() - new Date(time) < 30 * 1000)
    return false;
  return true;
}

export async function submit({ pid, uid, cid, language, code }) {
  await signInUid({ uid });
  const { prob } = await getProb({ uid, pid, cid });
  if (cid)pid = prob.ppid;
  var lastSub = await SubDB.findOne({
    order: sql.col("timestamp"),
    where: { uid: hashUidInDB(uid) }
  });
  if (!(await isAdmin({ uid })) && lastSub && !isCDOver(lastSub.timestamp))
    throw "cd error";
  if (!languages[language]) throw "no such lang";
  var { sid } = await SubDB.create({ uid: hashUidInDB(uid), pid, cid, language, ...newSub });
  fs.writeFile(`./data/sub/${sid}`, code, async err => {
    if (err) console.log(err);
    exec(sid);
  });
  return { sid };
}

export async function editSub({ sid, uid, code }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  var [exists, ] = await SubDB.update(newSub, { where: { sid } });
  if (!exists) throw "no such sub";
  fs.writeFile(`./data/sub/${sid}`, code, async err => {
    if (err) console.log(err);
    exec(sid);
  });
  return null;
}

export async function rejudge({ sid, uid, code }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  var [exists, ] = await SubDB.update(newSub, { where: { sid } });
  if (!exists) throw "no such sub";
  execUnlimited(sid);
  return null;
}

function tryParseInt(...x) {
  var a = parseInt(...x);
  if (isNaN(a)) throw "arguments error";
  return a;
}

export async function addProb({ uid, prob }, files) {
  prob = JSON.parse(prob);
  var cnt = 0;
  for (var subtask of prob.testSuite)
    for (var testcase of subtask.testcases) {
      testcase.tid = ++cnt;
      testcase.timeLimit = tryParseInt(testcase.timeLimit);
      testcase.memLimit = tryParseInt(testcase.memLimit);
    }
  if (!await isAdmin({ uid })) throw "you have no permission";
  if (prob.pid)
    await ProbDB.update(prob, { where: { pid: prob.pid } });
  else
    prob = await ProbDB.create(prob);
  if (files)
    for (let fileName in files)
      files[fileName].mv(`data/prob/${prob.pid}/${fileName}`);

  return { pid: prob.pid };
}

export async function getSubs({ uid, cid }) {
  var admin = await isAdmin({ uid });
  var cids = Array.from((await getConts({ uid })).conts)
    .filter(c => admin || c.end < new Date())
    .map(c => c.cid)
    .concat(0)
    .filter(c => !cid || c === parseInt(cid));
  return { subs: await SubDB.findAll({
    where: { cid: { [Op.in]: cids } },
    include: [
      { model: UserDB, attributes: ["handle"] },
      { model: ProbDB, attributes: ["title"] }
    ]
  }) };
}

export async function getDashboardData({ uid }) {
  var user = await UserDB.findByPk(hashUidInDB(uid), {
    include: [
      { model: SubDB, attributes: ["verdict", "score", "timestamp", "pid"],
        include: [{ model: ProbDB, attributes: ["difficulty"] }]
      }
    ]
  });
  var { probs } = await getProbs({ uid });
  return { user, probs };
}

export async function addCont({ uid, cont }) {
  cont.problems = cont.problems.map(i => parseInt(i));
  if (!await isAdmin({ uid })) throw "you have no permission";
  if (cont.cid)
    await ContDB.update(cont, { where: { cid: cont.cid } });
  else
    cont = await ContDB.create(cont);
  return { cid: cont.cid };
}

export async function getPosts({ cid = 0, uid }) {
  return {
    posts: await PostDB.findAll({
      include: [{ model: UserDB, attributes: ["handle"] }],
      order: [[sql.col("updatedAt"), "DESC"]],
      where: {
        [Op.or]: {
          uid: hashUidInDB(uid),
          ...visible(await isAdmin({ uid }))
        },
        cid
      }
    })
  };
}

export async function replyPost({ poid, uid, reply }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  await PostDB.update({ reply }, { where: { poid } });
  return null;
}

export async function addPost({ uid, cid = 0, content }) {
  await signInUid({ uid });
  uid = hashUidInDB(uid);
  var lastPost = await PostDB.findOne({
    order: sql.col("createdAt"),
    where: { uid }
  });
  if (!(await isAdmin({ uid })) && lastPost && !isCDOver(lastPost.createdAt))
    throw "cd error";
  var { poid } = await PostDB.create({ content, uid, cid });
  return { poid };
}

export async function alterPost({ poid, uid, visibility }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  await PostDB.update({ visibility }, { where: { poid } });
  return null;
}
