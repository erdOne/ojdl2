import Sequelize from "sequelize";

export const typeJSON = key => ({
  type: Sequelize.TEXT,
  get: function() {
    return JSON.parse(this.getDataValue(key));
  },
  set: function(val) {
    this.setDataValue(key, typeof val === "string" ? val : JSON.stringify(val));
  }
});
