import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import * as api from "./api.js";

import fs from "fs";
import http from "http";
import https from "https";
import hsts from "hsts";

import config from "../../config.js"

var app = express();

//app.set("port", process.env.PORT || 80);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(hsts({ maxAge: 31536000 }));

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
