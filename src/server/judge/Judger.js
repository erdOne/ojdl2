import { ErrorResult, ErrorTestResult, Result } from "./results.js";
import verdicts from "../../common/verdicts.js";

class TestcaseJudger {
  constructor(Tester, Comparator) {
    this.Tester = Tester;
    this.Comparator = Comparator;
  }

  async judge({ jid, tid }, { timeLimit, memLimit }) {
    try {
      var result;
      do result = await this.Tester.test({ jid, tid }, { timeLimit, memLimit });
      while (result.verdict === verdicts.SE);
      var comparatorResult = await this.Comparator.compare({ jid, tid }, result);
      if (comparatorResult.time > parseInt(timeLimit))
        comparatorResult.vertict = verdicts.TLE;
      if (comparatorResult.mem > parseInt(memLimit))
        comparatorResult.vertict = verdicts.MLE;
      return comparatorResult;
    } catch (err) {
      console.error("testcase judger got error:", err);
      return new ErrorTestResult(tid, err);
    }
  }
}

export default class Judger {
  constructor(Tester, Comparator, Uploader) {
    this.testcaseJudger = new TestcaseJudger(Tester, Comparator);
    this.Uploader = Uploader;
  }

  getLimits({ timeLimit, memLimit }) {
    return { timeLimit, memLimit };
  }

  async judge(jid, testSuite) {
    this.result = new Result(testSuite);
    try {
      await Promise.all(testSuite.map(async (subtask, si) => {
        await Promise.all(subtask.testcases.map(async (testcase, ti) => {
          var limits = this.getLimits(testcase),
            result = await this.testcaseJudger.judge({ jid, tid: testcase.tid }, limits);
          this.result.addResult(si, ti, result);
          this.Uploader.upload(this.result);
        }));
        this.result.endJudge(si, subtask.score);
      }));
      this.result.tryAC();
      this.result.pending = false;
    } catch (e) {
      console.log("Judger got error:");
      console.error(e);
      this.result = new ErrorResult(e);
    }
    this.Uploader.upload(this.result);
  }
}
