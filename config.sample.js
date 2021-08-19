const { readFileSync, existsSync } = require("fs");

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
  if (existsSync(path)) {
    const [ url, response ] = readFileSync(path, "utf-8").split("\n");
    return { url, response };
  } else {
    return { url: "/challenge/url", response: "" };
  }
}

function getCerts(certPath, keyPath) {
  if (existsSync(certPath) && existsSync(keyPath)) {
    const cert = readFileSync(certPath);
    const key = readFileSync(keyPath);
    return { cert, key };
  } else {
    return { cert: "", key: "" };
  }
}

exports.credentials = {
  challenge: getChallenge("/path/to/challenge.txt"),
  certs: getCerts("/path/to/fullchain.pem", "/path/to/privkey.pem")
};


exports.cookie = {
  secret: "cookie_secret_string_for_sign",
  maxAge: 12 * 60 * 60 * 1000, // 12 hours
}
exports.sandbox = {
  offset: 0,
  limit: 10
};
