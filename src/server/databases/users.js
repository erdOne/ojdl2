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
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  motto: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ""
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
};
