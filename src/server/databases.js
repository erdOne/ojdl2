const Sequelize = require("sequelize");
const { db } = require("../../config.js");
import * as definitions from "./databases/index.js";


const sequelize = new Sequelize(db.schema, db.user, db.password, definitions.schema);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

export const UserDB = sequelize.define("users", definitions.users);

export const SubDB = sequelize.define("submissions", definitions.submissions);

export const ProbDB = sequelize.define("problems", definitions.problems);

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

export async function init() {
  UserDB.sync({ force: true });
  SubDB.sync({ force: true });
  PostDB.sync({ force: true });
  ProbDB.sync({ force: true });
  ContDB.sync({ force: true })
    .then(()=>
      ContDB.create({ where: { cid: 0, start: new Date(0), end: new Date(0) } })
    );
}
