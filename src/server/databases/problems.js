import Sequelize from "sequelize";
import { typeJSON } from "./utils.js";

export default {
  pid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    initialAutoIncrement: 7000
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fullTitle: {
    type: new Sequelize.VIRTUAL(Sequelize.STRING, ["pid", "title"]),
    get: function() {
      return `${this.getDataValue("pid")} - ${this.getDataValue("title")}`;
    }
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  subtitle: {
    type: Sequelize.STRING,
    allowNull: true
  },
  visibility: {
    type: Sequelize.ENUM("visible", "contest", "hidden"),
    allowNull: false,
    defaultValue: "hidden"
  },
  samples: {
    ...typeJSON("samples"),
    allowNull: true,
    defaultValue: "[]"
  },
  testSuite: {
    ...typeJSON("testSuite"),
    allowNull: true,
    defaultValue: "[]"
  },
  testMethod: {
    type: Sequelize.ENUM("string", "special", "float", "multiple", "interactive"),
    allowNull: false,
    defaultValue: "string"
  },
  judgeParam: {
    type: Sequelize.STRING,
    allowNull: true
  },
  difficulty: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10
  }
};
