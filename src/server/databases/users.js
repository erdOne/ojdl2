import Sequelize from "sequelize";

export default {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  handle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  signature: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ""
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
};
