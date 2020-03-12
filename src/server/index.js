import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import * as api from "./api.js";

import fs from "fs";
import http from "http";
import https from "https";
import hsts from "hsts"

const privateKey = fs.readFileSync('/etc/letsencrypt/live/ojdl.ck.tp.edu.tw/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ojdl.ck.tp.edu.tw/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/ojdl.ck.tp.edu.tw/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var app = express();

app.set("port", process.env.PORT || 80);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(hsts({
  maxAge: 15552000
}));

const snakeToCamel = (str) => str.replace(/([-_]\w)/g, g => g[1].toUpperCase());

app.post("/api/:type", function(req, res) {
  var type = snakeToCamel(req.params.type);
  console.log(type);
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

app.get("/.well-known/acme-challenge/1x4KCTcxsX3xBvC2KlaB6BTf7fGvF4bDYAEeOqISlTs", (req, res)=>{
    res.send("1x4KCTcxsX3xBvC2KlaB6BTf7fGvF4bDYAEeOqISlTs.whdjVLUBTtQEYftp45Xfgxi9xS8Dp6egLhwAgfQ93zg");
});

app.use(function(req, res) {
  fs.readFile(path.join(__dirname, "../../public/index.html"), (err, data)=>{
    if (err) console.error(err);
    res.write(data);
    res.end();
  });
});

http.createServer(app).listen(80);
https.createServer(credentials, app).listen(443);
