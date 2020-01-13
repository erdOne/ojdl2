/* eslint-disable max-len */
export default {
  "c++17": {
    id: "c++17",
    mode: "text/x-c++src",
    text: "C++17 (gcc)",
    buildArgs: ["-e", "--processes=5", "--", "/usr/bin/g++", "-std=c++17", "main.cpp", "-o", "main.o"],
    execArgs: ["--run", "--", "main.o"],
    source: "main.cpp",
    executable: "main.o"
  },
  "c": {
    id: "c",
    mode: "text/x-csrc",
    text: "C99 (gcc)"
  }
};
