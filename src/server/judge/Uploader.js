import { SubDB } from "../databases.js";

export default class Uploader {
  constructor(sid) {
    this.sid = sid;
  }

  upload(result) {
    return SubDB.update({
      verdict: result.verdict,
      time: result.time,
      memory: result.memory,
      score: result.score,
      result
    }, {
      where: { sid: this.sid },
      logging: false
    });
  }
}
