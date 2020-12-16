const { readFileSync } = require("fs");

exports.ports = {
  http: 80,
  https: 443
};

exports.ftpServer = {};

exports.db = {
  schema: "schema",
  user: "user",
  password: "password"
};

function getChallenge(path) {
  if(existsSync(path)) {
    const [ url, response ] = readFileSync(path).split('\n');
    return { url, response };
  } else {
    return { url: "/foo/jizz", response: "" };
  }
}

exports.credentials = {
  challenge: getChallenge("/path/to/challenge.txt"),
  certs: {
    cert: readFileSync("./fullchain.pem"),
    key: readFileSync("./privkey.pem")
  }
};

exports.sandbox = {
  offset: 0,
  limit: 10
};
