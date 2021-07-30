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
    // "-v",
    // "--stack=" + memLimit,
    "--cg-mem=" + memLimit * 4,
    "--mem=" + memLimit * 4,
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
  console.log(exitsig, msg);
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
    // console.log(args, this.getArgs(tid), result.stderr);
    // console.log(result.stderr);
    await boxClean();
    return {
      verdict: statusToErrCode(result.status, result.stderr.substr(0, 512)),
      msg: result.status ? result.stderr.substr(0, 512) : null
    };
  }
}

export class InteractiveTester extends Tester {
  getArgs(tid) {
    return ["/box/interact.js", "/box/judge", `/box/${tid}.in`, `/box/${tid}.out`, ...this.lang.execArgs];
    /* pipexec researching
    return ['/bin/pipexec', '--',
      '[', 'J', '/box/judge', `/box/${tid}.in`, `/box/${tid}.out`, ']',
      '[', 'P', ...this.lang.execArgs, ']',
      '[', 'C', '/bin/cat', ']',
      '"{J:1>P:0}"',
      '"{P:1>J:0}"',
      '"{J:2>C:0}"',
    ];
    */
  }
}

const testers = {
  interactive: InteractiveTester
};

export function getTester(str) {
  return testers[str] || Tester;
}
