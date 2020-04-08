import Sequelize from "sequelize";
import { typeJSON } from "./utils.js";

export default {
  sid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  uid: {
    type: Sequelize.STRING,
    allowNull: false
  },
  verdict: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  time: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  memory: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  result: {
    ...typeJSON("result"),
    allowNull: true
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  cid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  pid: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  language: {
    type: Sequelize.STRING,
    allowNull: false,
    default: "C++"
  }
};
