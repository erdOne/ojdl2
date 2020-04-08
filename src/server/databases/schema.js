export default {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT+8",
  },
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    dialectOptions: {
      timezone: "Etc/GMT+8",
      collate: "utf8_general_ci"
    },
    timestamps: true
  }
};
