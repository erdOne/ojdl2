import fs from "fs";
import Codes from "../../client/common/verdicts.js";
import { ord } from "../utils.js";
import { parseMeta, metaToErrCode, readOutput } from "./comparatorUtils.js";
import { TestResult } from "./results.js";

const workdir = "./workdir";

export default class Comparator {
  async compare({ jid, tid }, { verdict, msg }) {
    var meta = parseMeta(fs.readFileSync(`${workdir}/${jid}/${tid}.meta`, {
      encoding: "utf-8"
    }));
    var result = new TestResult(tid, {
      verdict: Math.min(verdict, metaToErrCode(meta)),
      time: Math.ceil(parseFloat(meta.time) * 1000),
      memory: parseInt(meta.cg_mem),
      msg
    });
    if (result.verdict === Codes.UN)
      [result.verdict, result.msg] = await this.compareOutput(jid, tid);
    return result;
  }

  async compareOutput(jid, tid) {
    return this.compareText(
      await readOutput(`${workdir}/${jid}/${tid}.xout`),
      await readOutput(`${workdir}/${jid}/${tid}.out`)
    );
  }

  compareText(a, b) {
    if (a.length !== b.length)
      return [Codes.WA,
        `The length of your output is ${a.length}, but the correct length is ${b.length}.`
      ];
    for (var i = 0; i < a.length; i++) {
      if (a[i].length !== b[i].length)
        return [Codes.WA,
          `The ${ord(i + 1)} line of your output has ${a[i].length} terms,`
          + ` but it should have ${b[i].length} terms.`
        ];
      for (var j = 0; j < b[i].length; j++)
        if (!this.compareTerm(a[i][j], b[i][j]))
          return [Codes.WA,
            `The ${ord(j + 1)} term of the ${ord(i + 1)} line of your output is incorrect.\n`
            + "Your output is: \n"
            + `${a[i][j]}\n`
            + "But the correct output is \n"
            + `${b[i][j]}\n.`
          ];
    }
    return [Codes.AC, "OK"];
  }

  compareTerm(a, b) {
    throw ["Test", 0, "no such test method"];
  }
}
