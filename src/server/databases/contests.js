import Sequelize from "sequelize";
import { typeJSON } from "./utils.js";

export default {
  cid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    initialAutoIncrement: 0
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ""
  },
  abbr: {
    type: Sequelize.STRING,
    allowNull: true
  },
  start: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  end: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  problems: {
    ...typeJSON("problems"),
    allowNull: true,
    defaultValue: "[]"
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  visibility: {
    type: Sequelize.ENUM("visible", "hidden"),
    allowNull: false,
    defaultValue: "hidden"
  }
};
