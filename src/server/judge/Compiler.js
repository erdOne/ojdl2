import fs from "fs";
import languages from "../../client/common/languages.js";
import { tryfork } from "../utils.js";

export default class Compiler {
  constructor(lang) {
    this.lang = languages[lang];
  }

  async compile(jid, sid) {
    fs.copyFileSync(`./data/sub/${sid}`, `./workdir/${jid}/${this.lang.source}`);
    if (!this.lang.buildArgs) return;
    var { boxExec, boxClean } = await global.sandBoxQueue.request();
    const COMPILE_TIME_LIMIT = 2.0; // second
    const args = [`--dir=/box=${process.cwd()}/workdir/${jid}:rw`,
      `--time=${COMPILE_TIME_LIMIT}`, `--wall-time=${COMPILE_TIME_LIMIT * 1.1}`, "--run"];
    try {
      // console.log(...args, ...this.lang.buildArgs)
      tryfork(await boxExec(...args, ...this.lang.buildArgs), "Compile");
      tryfork(await boxExec(...args, "/bin/chmod", "755", this.lang.executable), "Give Permission");
    } finally {
      boxClean();
    }
  }
}
