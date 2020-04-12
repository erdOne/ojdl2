import Comparator from "./Comparator.js";
import { execSync } from "child_process";
import Codes from "../../client/common/verdicts.js";
import Big from "big.js";

import { readOutput } from "./comparatorUtils.js";

const workdir = "./workdir";

class SpecialComparator extends Comparator {
  async compareOutput(jid, tid) {
    var judgeResult = execSync(`${workdir}/${jid}/judge ${tid}.in ${tid}.out ${tid}.xout`);
    return [parseInt(judgeResult) ? Codes.AC : Codes.WA, judgeResult];
  }
}

class StringComparator extends Comparator {
  compareTerm(a, b) {
    return String(a) === String(b);
  }
}

class FloatComparator extends Comparator {
  constructor(params) {
    super(params);
    this.prec = params;
  }

  compareTerm(a, b) {
    var diff = new Big(a).minus(b).abs();
    return diff.lte(this.prec)
      || diff.lte(new Big(a).times(this.prec))
      || diff.lte(new Big(b).times(this.prec));
  }
}

class MultipleComparator extends StringComparator {
  async compareOutput(jid, tid) {
    var userOut = await readOutput(`${workdir}/${jid}/${tid}.xout`),
      correctOut = await readOutput(`${workdir}/${jid}/${tid}.out`),
      partialOut = await readOutput(`${workdir}/${jid}/${tid}.out2`),
      firstResult = this.compareText(userOut, correctOut);
    if (firstResult[0] === Codes.AC) return firstResult;
    var secondResult = this.compareText(userOut, partialOut);
    if (secondResult[0] === Codes.AC) {
      secondResult[0] = Codes.PAC;
      return secondResult;
    }
    firstResult[1] += "\n" + secondResult[1];
    return firstResult;
  }
}

const comparators = {
  string: StringComparator,
  float: FloatComparator,
  special: SpecialComparator,
  multiple: MultipleComparator
};

export function getComparator(str) {
  return comparators[str] || Comparator;
}
