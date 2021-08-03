import { promises as fsP } from "fs";
import verdicts from "../../common/verdicts.js";

export function parseMeta(data) {
  return Object.fromEntries(data.split("\n").map(item =>
    [item.split(":")[0].replace(/-/g, "_"), item.split(":")[1]]
  ));
}

export function metaToErrCode({ status, exitsig }) {
  switch (status) {
    case "TO":
      return verdicts.TLE;
    case "RE":
      return verdicts.RE;
    case "XX":
      return verdicts.SE;
    case "SG":
      if (exitsig === 9) return verdicts.MLE;
      if (exitsig === 6) return verdicts.MLE;
      if (exitsig === 11) return verdicts.SF;
  }
  return verdicts.UN;
}


export function readOutput(path) {
  return fsP.readFile(path, {
    encoding: "utf-8"
  }).then(data => {
    data = data.replace(/\0/g, "").replace(/\r/g, "").split("\n");
    while (data.slice(-1)[0] === "") data.pop();
    return data.map(line => line.split(" ").filter(x=>x.length));
  }).catch(e => {
    console.error(e);
    throw e;
  });
}
