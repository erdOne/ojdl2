import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import session from "express-session";
import * as api from "./api.js";

import fs from "fs";
import http from "http";
import https from "https";
import hsts from "hsts";

import config from "../../config.js"

// ['log','warn','error'].forEach(a=>{let b=console[a];console[a]=(...c)=>{try{throw new Error}catch(d){b.apply(console,[d.stack.split('\n')[2].trim().substring(3).replace(__dirname,'').replace(/\s\(./,' at ').replace(/\)/,''),'\n',...c])}}}); // display current function
/* ['log', 'warn', 'error'].forEach(t => {
  let f = console[t];
  console[t] = (...args) => {
    f.apply(console, [`[${new Date()}]`, ...args]);
  };
}); */

var app = express();

//app.set("port", process.env.PORT || 80);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(hsts({ maxAge: 31536000 }));

app.use(session({
  secret: 'test',
  name: 'uid',
  saveUninitialized: false,
  cookie: {
    maxAge: 12 * 60 * 1000
  }
}));
app.post("/api/cookie-make", async function(req, res) {
  try {
    const { uid } = req.body;
    const user = await api["getUser"]({ uid });
    req.session.uid = uid;
    res.send({ error: false });
  } catch(err) {
    console.log("Cookie make error", err);
    res.send({ error: true, msg: err });
  }
});
app.post("/api/cookie-get-uid", async function (req, res) {
  try {
    const uid = req.session.uid;
    if (!uid) throw "Invalid cookie!";
    const user = await api["getUser"]({ uid });
    res.send({ uid });
  } catch(err) {
    console.log("Cookie get error", err);
    res.send({ uid: null });
  }
});
app.post("/api/cookie-destroy", async function (req, res) {
  try {
    const uid = req.session.uid;
    if (!uid) throw "Destroying empty cookie!";
    req.session.destroy(() => console.log("session destroyed!"));
    res.send({ error: false });
  } catch(err) {
    console.log("Cookie destroy error", err);
    res.send({ error: true, msg: err });
  }
});

const snakeToCamel = (str) => str.replace(/([-_]\w)/g, g => g[1].toUpperCase());

app.post("/api/:type", function(req, res) {
  var type = snakeToCamel(req.params.type);
  if (!(type in api))
    res.sendStatus(400);
  else
    api[type](req.body, req.files).then(x => {
      res.send({ error: false, ...x });
      res.end();
    }).catch(err => {
      console.error(err);
      res.send({ error: true, msg: String(err) });
      res.end();
    });

});

app.get("/download/:filename", function(req, res, next) {
  var filename = req.params.filename;
  if (filename.match(/[\d]+_[\d]+_[\d]+\.zip/)) {
    res.download(`workdir/${filename}`, filename, function(err) {
      if (err) {
        console.error(err);
        next();
      }
      fs.unlink(`workdir/${filename}`, () => console.log(`Removed workdir/${filename} successfully`));
    });
  } else {
    next();
  }
});

app.use("/dist", express.static(path.join(__dirname, "../../public/dist")));
app.use("/images", express.static(path.join(__dirname, "../../public/images")));
app.use("/fonts", express.static(path.join(__dirname, "../../public/fonts")));

app.get(config.credentials.challenge.url, (req, res)=>{
    res.send(config.credentials.challenge.response);
});

app.use(function(req, res) {
  fs.readFile(path.join(__dirname, "../../public/index.html"), (err, data)=>{
    if (err) console.error(err);
    res.write(data);
    res.end();
  });
});

//app.listen(8080, "127.0.0.1");

http.createServer(app).listen(config.ports.http);
https.createServer(config.credentials.certs, app).listen(config.ports.https);
