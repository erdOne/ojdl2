#!/bin/node
// console.log("[Interactive]");
var { spawn } = require("child_process");
var interactor = spawn(process.argv[2], [process.argv[3], process.argv[4]], {
  stdio: ["pipe", "pipe", process.stdout]
});
var solution = spawn(process.argv[5], process.argv.slice(6), {
  stdio: [interactor.stdout, interactor.stdin, "inherit"]
});
var code = 0;
solution.on("close", c => {
  interactor.stdin.end();
  interactor.stdout.end();
  code = c;
});
interactor.on("close", () => process.exit(code));
interactor.on("error", e => {
  console.error("Interactor Error:", e);
  process.exit(71);
});
solution.on("error", e => {
  console.error("Runtime Error:", e);
  process.exit(22);
});
