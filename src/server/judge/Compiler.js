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
    const args = ['-v', '-v', `--dir=/box=${process.cwd()}/workdir/${jid}:rw`, "--time=2", "--run"];
    try {
      // console.log(...args, ...this.lang.buildArgs)
      tryfork(await boxExec(...args, ...this.lang.buildArgs), "Build");
      tryfork(await boxExec(...args, "/bin/chmod", "755", this.lang.executable), "Give Permission");
    } catch (e) {
      boxClean();
      if (e instanceof Array) throw e;
      throw ["Compiler", 0, e];
    }
    boxClean();
  }
}
