import Comparator from "./Comparator.js";
import { execSync } from "child_process";
import Codes from "../../client/common/verdicts.js";
import Big from "big.js";

const workdir = "./workdir";

class SpecialComparator extends Comparator {
  async compareOutput(jid, tid) {
    var judgeResult = execSync(`${workdir}/${jid}/judge ${tid}.in ${tid}.xout`);
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

const comparators = {
  string: StringComparator,
  float: FloatComparator,
  special: SpecialComparator
};

export function getComparator(str) {
  return comparators[str] || Comparator;
}
