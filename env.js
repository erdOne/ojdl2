const { readFileSync, existsSync } = require("fs");
const dotenv = require("dotenv");
const result = dotenv.config();

const {
  PORTS_HTTP,
  PORTS_HTTPS,
  DB_SCHEMA,
  DB_USER,
  DB_PASSWORD,
  SANDBOX_OFFSET,
  SANDBOX_LIMIT,
  COOKIE_SECRET,
  COOKIE_MAX_AGE,
  SSL_CERTIFICATE_PATH,
  SSL_PRIVATE_KEY_PATH
} = process.env;

const toInt = s => parseInt(s, 10);

exports.ports = {
  http: toInt(PORTS_HTTP),
  https: toInt(PORTS_HTTPS)
};

exports.db = {
  schema: DB_SCHEMA,
  user: DB_USER,
  password: DB_PASSWORD
};

exports.sandbox = {
  offset: toInt(SANDBOX_OFFSET),
  limit: toInt(SANDBOX_LIMIT)
};

exports.cookie = {
  secret: COOKIE_SECRET,
  maxAge: toInt(COOKIE_MAX_AGE)
};

function resolve(path, fallback) {
  if (existsSync(path)) {
    return readFileSync(path);
  }
  return fallback;
}

function getChallenge() {
  const path = ".challenge.env";
  const config = dotenv.parse(resolve(path, ""));
  return {
    url: config.CHALLENGE_URL,
    response: config.CHALLENGE_RESPONSE
  };
}

exports.credentials = {
  challenge: getChallenge(),
  certs: {
    cert: resolve(SSL_CERTIFICATE_PATH, null),
    key: resolve(SSL_PRIVATE_KEY_PATH, null)
  }
};
