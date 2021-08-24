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
    allowNull: false,
    defaultValue: ""
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    detaultValue: ""
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  lastSignIn: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ""
  }
};
