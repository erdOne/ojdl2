import verdicts from "../../client/common/verdicts.js";

function fullError(err) {
  return err.message + "\n" + (err.stack || "");
}

class GeneralResult {
  constructor({ verdict = verdicts.UN, time = 0, memory = 0, msg = "" } = {}) {
    Object.assign(this, { verdict, time, memory, msg });
  }
  update(res) {
    this.time += res.time;
    this.memory = Math.max(res.memory, this.memory);
    this.verdict = Math.min(res.verdict, this.verdict);
  }
}

export class TestResult extends GeneralResult {
  constructor(tid, props) {
    super(props);
    this.tid = tid;
  }
}

export class ErrorTestResult extends TestResult {
  constructor(tid, error) {
    super(tid, { verdict: verdicts.SE, msg: error.message || fullError(error) });
  }
}

class ScoreResult extends GeneralResult {
  constructor({ score = 0, ...props } = {}) {
    super(props);
    this.score = score;
  }
  tryAC(score = 0) {
    if (this.verdict === verdicts.UN) {
      this.verdict = verdicts.AC;
      this.score += score;
      return true;
    }
    return false;
  }
}

class SubtaskResult extends ScoreResult {
  constructor(no, subtask) {
    super();
    this.no = no;
    this.testResult = subtask.testcases.map(testcase => new TestResult(testcase.tid));
  }
  addResult(ti, result) {
    this.testResult[ti] = result;
    this.update(result);
  }
}

export class Result extends ScoreResult {
  constructor(testSuite) {
    if (testSuite instanceof Array) {
      super();
      this.subtaskResult = testSuite.map((subtask, no) => new SubtaskResult(no + 1, subtask));
      this.pending = true;
    } else {
      super(testSuite);
      this.subtaskResult = [];
    }
  }
  addResult(si, ti, result) {
    this.subtaskResult[si].addResult(ti, result);
    this.update(result);
  }
  endJudge(si, score) {
    if (this.subtaskResult[si].tryAC(score))
      this.score += score;
  }
}

export class ErrorResult extends Result {
  constructor(e) {
    super({
      verdict: e[0] === "Compile" ? verdicts.CE : verdicts.SE,
      msg: e[0] === undefined ? fullError(e) : `${e[0]} error exited with code ${e[1]}\n${e[2]}`
    });
  }
}
