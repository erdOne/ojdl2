import languages from "../../client/common/languages.js";
import verdicts from "../../client/common/verdicts.js";

function testArgs({ jid, tid }, { timeLimit, memLimit }) {
  return [
    `--dir=/box=${process.cwd()}/workdir/${jid}:rw`,
    `--stdin=${tid}.in`,
    `--stdout=${tid}.xout`,
    `--meta=workdir/${jid}/${tid}.meta`,
    "--time=" + timeLimit / 1000,
    "--extra-time=" + timeLimit / 1000 * 0.1,
    "--wall-time=" + timeLimit / 1000 * 10,
    "--cg",
    //"-v",
    //"--stack=" + memLimit,
    "--cg-mem=" + memLimit * 2,
    "--mem=" + memLimit * 2,
    "-e",
    "--processes",
    "--run",
    "--",
  ];
}

function statusToErrCode(exitsig, msg) {
  if (msg === "Time limit exceeded\n") return verdicts.TLE;
  if (msg === "Caught fatal signal 9\n") return verdicts.MLE;
  if (msg === "Caught fatal signal 11\n") return verdicts.SF;
  if (exitsig === 2) throw new Error(msg);
  //console.log(exitsig, msg);
  if (exitsig) return verdicts.RE;
  return verdicts.UN;
}

export default class Tester {
  constructor(lang) {
    this.lang = languages[lang];
  }

  getArgs(tid) {
    return this.lang.execArgs;
  }

  async test({ jid, tid }, { timeLimit, memLimit }) {
    var { boxExec, boxClean } = await global.sandBoxQueue.request();
    timeLimit = parseInt(timeLimit); memLimit = parseInt(memLimit);
    var args = testArgs({ jid, tid }, { timeLimit, memLimit }),
      result = await boxExec(...args, ...this.getArgs(tid));
		boxClean();
    return {
      verdict: statusToErrCode(result.status, result.stderr),
      msg: result.status ? result.stderr.substr(0, 256) : null
    };
  }
}

export class InteractiveTester extends Tester {
  getArgs(tid) {
    var pipeargs = x => `/bin/pipexec -- [ int /box/judge /box/${tid}.in ] [ sol ${x} ]`;
    return ["./interact.js", "/box/judge", `/box/${tid}.in`, `/box/${tid}.out`, ...this.lang.execArgs];
  }
}

const testers = {
  interactive: InteractiveTester
};

export function getTester(str) {
  return testers[str] || Tester;
}
