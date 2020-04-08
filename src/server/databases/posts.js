import Sequelize from "sequelize";

export default {
  poid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  uid: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cid: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  reply: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  visibility: {
    type: Sequelize.ENUM("visible", "hidden"),
    allowNull: false,
    defaultValue: "hidden"
  }
};
