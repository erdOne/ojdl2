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

exports.credentials = {
  challenge: {
    url: "/foo/bar",
    response: "response"
  },
  certs: {
    cert: readFileSync("./fullchain.pem"),
    key: readFileSync("./privkey.pem")
  }
};

exports.sandbox = {
  offset: 0,
  limit: 10
};
