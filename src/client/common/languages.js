/* eslint-disable max-len */
export default {
  "c++17": {
    id: "c++17",
    mode: "text/x-c++src",
    text: "C++17 (gcc)",
    buildArgs: ["--cg", "--env=PATH=/bin:/usr/local/bin", "--processes", "--", "/usr/local/bin/g++", "-v", "-static", "-std=c++17", "-O2", "main.cpp", "-o", "main.out"],
    execArgs: ["./main.out"],
    source: "main.cpp",
    executable: "main.out"
  },
  "c": {
    id: "c",
    mode: "text/x-csrc",
    text: "C (gcc)",
    buildArgs: ["--cg", "--env=PATH=/bin:/usr/local/bin", "--processes", "--", "/usr/local/bin/gcc", "-static", "main.c", "-o", "main.out"],
    execArgs: ["./main.out"],
    source: "main.c",
    executable: "main.out"
  },
  "haskell": {
    id: "haskell",
    mode: "text/x-haskell",
    text: "haskell (ghc)",
    buildArgs: ["--cg", "--env=PATH=/bin:/usr/local/bin", "--processes=10", "--", "/usr/bin/ghc", "-dynamic", "-tmpdir", ".", "main.hs", "-o", "main.out"],
    execArgs: ["./main.out"],
    source: "main.hs",
    executable: "main.out"
  },
  "js": {
    id: "js",
    mode: "text/javascript",
    text: "javascript (node)",
    execArgs: ["/usr/bin/node", "main.js"],
    source: "main.js",
    executable: "main.js"
  }
};
