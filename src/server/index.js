import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import http from "http";
import https from "https";
import hsts from "hsts";
import fs from "fs";

import * as api from "./api.js";
import * as sessionApi from "./session-api.js";

import { cookie, credentials, ports } from "../../env.js";

// ['log','warn','error'].forEach(a=>{let b=console[a];console[a]=(...c)=>{try{throw new Error}catch(d){b.apply(console,[d.stack.split('\n')[2].trim().substring(3).replace(__dirname,'').replace(/\s\(./,' at ').replace(/\)/,''),'\n',...c])}}}); // display current function
/* ['log', 'warn', 'error'].forEach(t => {
  let f = console[t];
  console[t] = (...args) => {
    f.apply(console, [`[${new Date()}]`, ...args]);
  };
}); */

let app = express();

var logger = require('morgan');
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(hsts({ maxAge: 31536000 }));

app.use(session({
  secret: cookie.secret,
  name: "uid",
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: cookie.maxAge
  }
}));

const snakeToCamel = (str) => str.replace(/([-_]\w)/g, g => g[1].toUpperCase());

app.post("/api/:type", function(req, res) {
  var type = snakeToCamel(req.params.type);
  if (type in api)
    api[type](req.body, req.files)
      .then(x => {
        res.send({ error: false, ...x });
        res.end();
      }).catch(err => {
        console.error(err);
        res.send({ error: true, msg: String(err) });
        res.end();
      });
  else if (type in sessionApi)
    sessionApi[type](req)
      .then(x => {
        res.send({ error: false, ...x });
        res.end();
      }).catch(err => {
        console.error(err);
        res.send({ error: true, msg: String(err) });
        res.end();
      });
  else
    res.sendStatus(400);

});

app.get("/download/:filename", function(req, res, next) {
  var filename = req.params.filename;
  if (filename.match(/[\d]+_[\d]+_[\d]+\.zip/))
    res.download(`workdir/${filename}`, filename, function(err) {
      if (err) {
        console.error(err);
        next();
      }
      fs.unlink(`workdir/${filename}`,
        () => console.log(`Removed workdir/${filename} successfully`));
    });
  else
    next();

});


if (credentials.challenge.url) {
  app.get(credentials.challenge.url, (req, res)=>{
    res.send(credentials.challenge.response);
  });
}

app.use("/dist", express.static(path.join(__dirname, "../../public/dist")));
app.use("/images", express.static(path.join(__dirname, "../../public/images")));
app.use("/fonts", express.static(path.join(__dirname, "../../public/fonts")));

app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

//app.listen(8080, "127.0.0.1");

http.createServer(app).listen(ports.http);
https.createServer(credentials.certs, app).listen(ports.https);
