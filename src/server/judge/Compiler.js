import fs from "fs";
import languages from "../../client/common/languages.js";
import { tryfork } from "../utils.js";

export default class Compiler {
  constructor(lang) {
    this.lang = languages[lang];
  }
  async compile(jid, sid) {
    var { boxExec, boxClean } = await global.sandBoxQueue.request();
    const args = [`--dir=/box=${process.cwd()}/workdir/${jid}:rw`, "--run"];
    fs.copyFileSync(`./data/sub/${sid}`, `workdir/${jid}/${this.lang.source}`);
    try {
      tryfork(await boxExec(...args, ...this.lang.buildArgs), "Compile");
      tryfork(await boxExec(...args, "/bin/chmod", "755", this.lang.executable), "Compile");
    } catch (e) {
      boxClean();
      if (e instanceof Array) throw e;
      throw ["Compiler", 0, e];
    }
    boxClean();
  }
}
