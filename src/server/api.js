/* eslint-disable max-lines */

import fs from "fs";
import { UserDB, SubDB, ProbDB, ContDB, PostDB } from "./databases.js";
import { exec, execUnlimited } from "./exec.js";
import { execSync } from "child_process";
import { hashUid, hashPswInDB, hashUidInDB } from "../common/hash.js";
import verdicts from "../common/verdicts.js";
import languages from "../common/languages.js";
import { toChars, fromChars } from "../common/char.js";
import sql, { Op } from "sequelize";

export async function getUser({ handle, uid }) {
  const hashedUid = hashUidInDB(uid);
  const editable = (await UserDB.findOne({
    where: handle ? { handle, uid: hashedUid } : { uid: hashedUid }
  })) !== null;
  const where = handle ? { handle } : { uid: hashedUid };
  const attributes = ["handle", "motto", "lastSignIn", "createdAt", "avatar"]
    .concat(editable ? ["uid", "email"] : []);
  let user = await UserDB.findOne({ where, attributes });
  if (!user) throw "no such user";
  const { uid: targetUid } = await UserDB.findOne({ where });
  const acProbs = await SubDB.count({
    where: { uid: targetUid, verdict: verdicts.AC },
    distinct: true, col: "pid"
  });
  const totalProbs = await SubDB.count({
    where: { uid: targetUid },
    distinct: true, col: "pid"
  });
  const acSubs = await SubDB.count({
    where: { uid: targetUid, verdict: verdicts.AC },
  });
  const totalSubs = await SubDB.count({
    where: { uid: targetUid },
  });
  return { editable, user, stats: { acProbs, totalProbs, acSubs, totalSubs } };
}

export async function getUsers({ limit, offset, filters = {} }) {
  const { handle } = filters;
  let where = {};
  if (handle)
    where.handle = { [Op.substring]: handle.replace(/[%_]/g, (match) => `\\${match}`) };
  const { rows: users, count: userCount } = await UserDB.findAndCountAll({
    limit, offset, where,
    attributes: [
      // https://stackoverflow.com/questions/33900750/sequelize-order-by-count-association
      [sql.literal(`(SELECT COUNT(DISTINCT pid) FROM submissions\
        WHERE submissions.uid=users.uid AND submissions.verdict=${verdicts.AC})`),
        "acProbCount"],
      "handle",
      "motto",
      "avatar",
    ],
    order: [[sql.literal("acProbCount"), "DESC"]],
  });
  // console.log(users);
  return { users, userCount };
}

function validateAvatarName(name) {
  const result = /[ \w-]{1,50}(\.[\w-]{1,4})?/.test(name);
  if (!result)
    throw "invalid avatar name";
}

function validateMotto(motto) {
  if (motto.length > 200)
    throw "motto length too long (at most 200)";
}

function validateEmail(email) {
  if (email.length > 200)
    throw "email length too long (at most 200)";
}

function validateHandle(handle) {
  const result = /[A-Za-z0-9_]{6,100}/.test(handle);
  if (!result)
    throw "invalid handle";
}

export async function updateUser({ uid, currentPassword, handle, password, motto, email }, files) {
  let user = await UserDB.findByPk(hashUidInDB(uid));
  if (!user)
    throw "no such user";
  if (user.password !== hashPswInDB(currentPassword))
    throw "current password wrong";
  if (files && files.avatar) {
    const avatar = files.avatar;
    const maxAvatarSize = 2 * 1024 * 1024; // 2 MB
    if (avatar.size >= maxAvatarSize)
      throw "avatar too big (at most 2 MB)";
    validateAvatarName(avatar.name);
    const orgFilename = user.avatar;
    if (orgFilename && orgFilename !== "") {
      fs.unlinkSync(`public/images/avatars/${orgFilename}`);
      console.log(`deleted old avatar ${orgFilename}`);
    }
    const filename = `${user.handle}.${avatar.name}`;
    const path = `public/images/avatars/${filename}`;
    await user.update({ avatar: filename });
    avatar.mv(path);
  }
  if (handle)
    throw "changing handle feature WIP";
  if (handle && password)
    throw "do not change handle and password at the same time";
  if (motto) {
    validateMotto(motto);
    await user.update({ motto });
  }
  if (email) {
    validateEmail(email);
    await user.update({ email });
  }
  if (password) {
    let newUid = hashUid(user.handle, password);
    await UserDB.update({ uid: hashUidInDB(newUid), password: hashPswInDB(password) },
      { where: { uid: hashUidInDB(uid) } });
    uid = newUid;
    user = await UserDB.findOne({ where: { handle: user.handle } });
    // console.log({ ...user });
    // hashPswInDB(password);
    // throw "changing handle/password WIP";
  }
  return {};
}

export async function isAdmin({ uid }) {
  var user = await UserDB.findOne({
    where: { uid: hashUidInDB(uid) },
    logging: false
  });
  return user !== null && user.admin;
}

export async function signUp({ handle, password }) {
  validateHandle(handle);
  var uid = hashUid(handle, password);
  var [, created] = await UserDB.findOrCreate({
    where: { handle },
    defaults: {
      uid: hashUidInDB(uid),
      password: hashPswInDB(password),
      email: "",
    }
  });
  if (!created) throw "handle taken";
  return null;
}

export async function signIn({ handle, password }) {
  var user = await UserDB.findOne({
    where: { handle }
  });
  if (!user) throw "no such user";
  if (user.password !== hashPswInDB(password)) throw "wrong password";
  await user.update({ lastSignIn: new Date() });
  return { isAdmin: user.admin };
}

export async function signInUid({ uid }) {
  var user = await UserDB.findByPk(hashUidInDB(uid));
  if (!user) throw "no such user";
  return { isAdmin: user.admin };
}

export async function getSub({ sid, uid, cid, withData }) {
  var admin = await isAdmin({ uid });
  var include = (
    withData
      ? [{ model: ProbDB, attributes: ["title"] }, { model: UserDB, attributes: ["handle"] }]
      : []
  ).concat([{
    model: ContDB.unscoped(),
    attributes: ["start", "end"]
    // where: admin || !cid ? {} : { cid }
  }]);
  var sub = await SubDB.findByPk(sid, { include });
  if (!sub || (sub.cid && cid && cid !== sub.cid)) throw "no such sub";
  if (sub.cid)
    if (!admin && (hashUidInDB(uid) !== sub.uid)) {
      var now = new Date();
      console.log(sub);
      var { start, end } = sub.contest;
      if (start <= now && now <= end) throw "contest is running, you have no permission";
    }

  var file = { hasData: false };
  if (withData && (hashUidInDB(uid) === sub.uid || admin)) {
    file.data = fs.readFileSync(`./data/sub/${sid}`, { encoding: "utf-8" });
    file.hasData = true;
  }
  return { sub, file };
}

function visible(admin) {
  return admin ? { visibility: { [Op.not]: "" } } : { visibility: "visible" };
}

export async function getConts({ uid, limit, offset }) {
  const { rows: conts, count: contCount } = await ContDB.findAndCountAll({
    limit, offset, where: visible(await isAdmin({ uid })),
    attributes: { exclude: ["problems"] }
  });
  return { conts, contCount };
}

export async function getCont({ uid, cid }) {
  var admin = await isAdmin({ uid });
  var cont = (await ContDB.findByPk(cid));
  if (!cont) throw "no such contest";
  cont = cont.get({ plain: true });
  if (!admin && cont.visibility === "hidden")
    throw "you have no permission";
  if (cont.start > new Date() && !admin) {
    cont.problems = [];
    //cont.content = "";
    cont.visible = false;
  } else
    cont.visible = true;

  if (cont.problems.length > 0) {
    var probs = await ProbDB.findAll({
      where: { pid: { [Op.in]: cont.problems } }
    });
    for (let i in cont.problems) {
      // console.log(cont.problems[i]);
      // console.log(probs.find(e => e.pid === cont.problems[i]));
      cont.problems[i] = probs.find(e => e.pid === cont.problems[i]).get({ plain: true });
      cont.problems[i].ppid = cont.problems[i].pid;
      cont.problems[i].pid = toChars(i);
      if (!admin)
        delete cont.problems[i].difficulty;
    }
  }
  return { cont };
}


function tryParseInt(...x) {
  var a = parseInt(...x);
  if (isNaN(a)) throw "arguments error";
  return a;
}

export async function getProbs({ uid, cid, order, limit, offset, filters = {} }) {
  var { problem_id: pid, problem_name: title } = filters;
  if (!cid) {
    var where = visible(await isAdmin({ uid }));
    if (pid)
      where.pid = tryParseInt(pid);
    if (title)
      where.title = { [Op.substring]: title.replace(/[%_]/g,
        (match) => `\\${match}`) }; // % and _
    const { rows: probs, count: probCount } = await ProbDB.findAndCountAll({
      order, limit, offset, where,
      attributes: ["pid", "title", "subtitle", "updatedAt", "visibility"]
    });
    const pids = probs.map(prob => prob.pid);
    const subs = await SubDB.findAll({
      where: { uid: hashUidInDB(uid), pid: { [Op.in]: pids } }, attributes: ["pid", "verdict"]
    });
    return { probs, probCount, subs };
  } else {
    var probs = (await getCont({ uid, cid })).cont.problems;
    var probCount = probs.length;
    probs = probs
      .filter(prob => !pid || prob.pid === pid)
      .filter(prob => !title || prob.title.indexOf(title) !== -1)
      .sort((a, b) => {
        for (const [key, orderBy] of Object.entries(filters)) if (a[key] !== b[key]) {
          const d = a[key] > b[key] ? 1 : -1;
          return orderBy === "asc" ? d : -d;
        }
        return 0;
      })
      .slice(offset, limit);
    const pids = probs.map(prob => prob.ppid);
    const subs = await SubDB.findAll({
      where: { uid: hashUidInDB(uid), pid: { [Op.in]: pids }, cid }, attributes: ["pid", "verdict"]
    });
    return { probs, probCount, subs };
  }
}

export async function getProb({ uid, pid, cid }) {
  var admin = await isAdmin({ uid });
  if (!cid) {
    let prob = await ProbDB.findByPk(pid);
    if (!prob) throw "no such prob";
    if (prob.visibility !== "visible" && !admin)
      throw "you have no permission";
    //console.log(prob.visibility, admin);
    let AC = !!(await SubDB.findOne({ where: { uid: hashUidInDB(uid), pid,
      verdict: verdicts.AC } }));
    let tried = !!(await SubDB.findOne({ where: { uid: hashUidInDB(uid), pid, } }));
    return { prob, AC, tried };
  } else {
    let { cont } = await getCont({ uid, cid }),
      prob = cont.problems[fromChars(pid)];
    if (!prob) throw "no such prob";
    pid = prob.ppid;
    let AC = !!(await SubDB.findOne({ where: { uid: hashUidInDB(uid), pid,
      verdict: verdicts.AC } }));
    let tried = !!(await SubDB.findOne({ where: { uid: hashUidInDB(uid), pid, } }));
    return { prob, AC, tried };
  }
}

const newSub = {
  result: {
    subtaskResult: [],
    score: 0,
    time: 0,
    memory: 0,
    verdict: verdicts.UN,
    pending: true
  },
  time: 0,
  memory: 0,
  verdict: verdicts.UN
};

function isCDOver(time) {
  if (!time || new Date() - new Date(time) < 30 * 1000)
    return false;
  return true;
}

export async function submit({ pid, uid, cid, language, code }) {
  await signInUid({ uid });
  const { prob } = await getProb({ uid, pid, cid });
  if (cid)pid = prob.ppid;
  var lastSub = await SubDB.findOne({
    order: [[sql.col("timestamp"), "DESC"]],
    where: { uid: hashUidInDB(uid) }
  });
  if (!(await isAdmin({ uid })) && lastSub && !isCDOver(lastSub.timestamp))
    throw "cd error";
  if (!languages[language]) throw "no such lang";
  var { sid } = await SubDB.create({ uid: hashUidInDB(uid), pid, cid, language, ...newSub });
  fs.writeFile(`./data/sub/${sid}`, code, async err => {
    if (err) console.log(err);
    exec(sid);
  });
  return { sid };
}

export async function editSub({ sid, uid, code }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  var [exists, ] = await SubDB.update(newSub, { where: { sid } });
  if (!exists) throw "no such sub";
  fs.writeFile(`./data/sub/${sid}`, code, async err => {
    if (err) console.log(err);
    exec(sid);
  });
  return null;
}

export async function rejudge({ sid, uid, code }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  var [exists, ] = await SubDB.update(newSub, { where: { sid } });
  if (!exists) throw "no such sub";
  execUnlimited(sid);
  return null;
}

export async function addProb({ uid, prob }, files) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  prob = JSON.parse(prob);
  var cnt = 0;
  for (var subtask of prob.testSuite)
    for (var testcase of subtask.testcases) {
      testcase.tid = ++cnt;
      testcase.timeLimit = tryParseInt(testcase.timeLimit);
      testcase.memLimit = tryParseInt(testcase.memLimit);
    }
  if (prob.pid)
    await ProbDB.update(prob, { where: { pid: prob.pid } });
  else
    prob = await ProbDB.create(prob);
  fs.mkdirSync(`data/prob/${prob.pid}`, { recursive: true });
  if (files)
    for (let fileName in files)
      files[fileName].mv(`data/prob/${prob.pid}/${fileName}`).then(() =>
        fileName === "judge.cpp" &&
          execSync(`g++ -std=c++17 data/prob/${prob.pid}/judge.cpp -o data/prob/${prob.pid}/judge`)
      );
  return { pid: prob.pid };
}

export async function getSubs({ uid, cid, order, limit, offset, filters = {} }) {
  var admin = await isAdmin({ uid });
  var cids = Array.from((await getConts({ uid })).conts)
    .filter(c => admin || c.end < new Date() || c.cid === parseInt(cid))
    .map(c => c.cid)
    .concat(0)
    .filter(c => !cid || c === parseInt(cid));
  var where = { cid: { [Op.in]: cids } };
  var {
    user_name: handle,
    problem_id: pid,
    filter_verdict: verdict,
    filter_language: language
  } = filters;
  if (handle) {
    var user = await UserDB.findOne({ where: { handle } });
    if (!user) return { subs: [], subCount: 0 };
    where.uid = user.uid;
  }
  if (pid)
    if (cid) {
      let { cont } = await getCont({ uid, cid });
      let prob = cont.problems.find(p => p.pid === pid);
      if (!prob) return { subs: [], subCount: 0 };
      where.pid = prob.ppid;
    } else {
      where.pid = tryParseInt(pid);
    }

  if (verdict)
    where.verdict = verdicts[verdict];
  if (language)
    where.language = language;
  let { rows, count } = await SubDB.findAndCountAll({
    order, limit, offset, where,
    include: [
      { model: UserDB, attributes: ["handle"] },
      { model: ProbDB, attributes: ["title"], required: true }
    ]
  });
  return { subs: rows, subCount: count };
}

export async function getDashboardData({ uid }) {
  var user = await UserDB.findByPk(hashUidInDB(uid), {
    include: [
      { model: SubDB, attributes: ["verdict", "score", "timestamp", "pid"],
        include: [{ model: ProbDB, attributes: ["difficulty"] }]
      }
    ]
  });
  var { probs } = await getProbs({ uid });
  return { user, probs };
}

export async function addCont({ uid, cont }) {
  let problems = cont.problems.map(i => parseInt(i));
  if (!await isAdmin({ uid })) throw "you have no permission";
  for (let pid of problems) {
    let prob = await ProbDB.findByPk(pid);
    if (!prob) throw `no such prob ${pid}`;
  }
  cont.problems = problems;
  if (cont.cid)
    await ContDB.update(cont, { where: { cid: cont.cid } });
  else
    cont = await ContDB.create(cont);
  return { cid: cont.cid };
}

export async function getPosts({ cid = 0, uid }) {
  return {
    posts: await PostDB.findAll({
      include: [{ model: UserDB, attributes: ["handle"] }],
      order: [[sql.col("pinned"), "DESC"], [sql.col("updatedAt"), "DESC"]],
      where: {
        [Op.or]: {
          uid: hashUidInDB(uid),
          ...visible(await isAdmin({ uid }))
        },
        cid
      }
    })
  };
}

export async function replyPost({ poid, uid, reply }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  await PostDB.update({ reply }, { where: { poid } });
  return null;
}

export async function addPost({ uid, cid = 0, content }) {
  await signInUid({ uid });
  var lastPost = await PostDB.findOne({
    order: [[sql.col("createdAt"), "DESC"]],
    where: { uid: hashUidInDB(uid) }
  });
  if (!(await isAdmin({ uid })) && lastPost && !isCDOver(lastPost.createdAt))
    throw "cd error";
  var { poid } = await PostDB.create({ content, uid: hashUidInDB(uid), cid });
  return { poid };
}

export async function alterPost({ poid, uid, visibility, content, pinned }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  if (visibility)
    await PostDB.update({ visibility }, { where: { poid } });
  if (content)
    await PostDB.update({ content }, { where: { poid } });
  if (pinned !== null)
    await PostDB.update({ pinned }, { where: { poid } });
  // console.log("ALTER POST", { visibility, content, pinned });
  return null;
}

export async function getLastLanguage({ uid }) {
  var lastSub = await SubDB.findOne({
    order: [[sql.col("sid"), "DESC"]],
    where: { uid: hashUidInDB(uid) }
  });
  return lastSub ? languages[lastSub.language] : null;
}

export async function downloadTestSuites({ uid, pid }) {
  if (!await isAdmin({ uid })) throw "you have no permission";
  const prob = await ProbDB.findOne({ where: { pid } });
  if (!prob) throw "no such prob";
  const folderpath = `data/prob/${pid}`;
  const filename = `${pid}_${new Date() % 1000}_${Math.floor(Math.random() * 1000)}.zip`;
  execSync(`zip -j -r workdir/${filename} ${folderpath}`);
  return { filename };
}
