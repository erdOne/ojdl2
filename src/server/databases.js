import Sequelize from "sequelize";
import { db } from "../../config.js";
import * as definitions from "./databases/index.js";
import mariadb from "mariadb";

const sequelize = new Sequelize(db.schema, db.user, db.password, definitions.schema);

export const UserDB = sequelize.define("users", definitions.users);

export const SubDB = sequelize.define("submissions", definitions.submissions);

export const ProbDB = sequelize.define("problems", definitions.problems, {
  initialAutoIncrement: 7000
});

export const ContDB = sequelize.define("contests", definitions.contests, {
  defaultScope: {
    where: { cid: { [Sequelize.Op.gt]: 0 } }
  }
});

export const PostDB = sequelize.define("posts", definitions.posts);


UserDB.hasMany(SubDB, { foreignKey: "uid" });
SubDB.belongsTo(UserDB, { foreignKey: "uid" });
ProbDB.hasMany(SubDB, { foreignKey: "pid" });
SubDB.belongsTo(ProbDB, { foreignKey: "pid" });
SubDB.belongsTo(ContDB, { foreignKey: "cid" });
ContDB.hasMany(PostDB, { foreignKey: "cid" });
PostDB.belongsTo(ContDB, { foreignKey: "cid" });
PostDB.belongsTo(UserDB, { foreignKey: "uid" });

async function initModel() {
  const option = {};
  try {
    await sequelize.sync(option);
    // create placeholder (cid = 0)
    if (!(await ContDB.findByPk(0))) {
      await ContDB.unscoped().create({ cid: 1, start: new Date(0), end: new Date(0) });
      await ContDB.decrement("cid", { by: 1 });
      // const cont = await ContDB.findByPk(0);
      // console.log("empty contest created", cont);
    }
  } catch(err) {
    console.error(err);
  }
  /*
  UserDB.sync(option);
  SubDB.sync(option);
  PostDB.sync(option);
  ProbDB.sync(option);
  ContDB.sync(option)
  */
}

async function init() {
  try {
    const pool = mariadb.createPool({
      host: 'localhost',
      user: db.user,
      password: db.password,
    });
    await pool.getConnection().then(conn => conn.query(`CREATE DATABASE IF NOT EXISTS ${db.schema}`)); // self-sqli?
    await sequelize.authenticate();
    await initModel();
    console.log("Connection has been established successfully.");
  } catch(err) {
    console.error("Unable to connect to the database.", err);
  }
}

init();

