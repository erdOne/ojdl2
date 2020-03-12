
const Sequelize = require("sequelize");
const { db } = require("../../secrets.js");

const sequelize = new Sequelize("OJDL", db.user, db.password, {
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
});

const typeJSON = key => ({
  type: Sequelize.TEXT,
  get: function() {
    return JSON.parse(this.getDataValue(key));
  },
  set: function(val) {
    this.setDataValue(key, typeof val === "string" ? val : JSON.stringify(val));
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

export const UserDB = sequelize.define("users", {
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
});


export const SubDB = sequelize.define("submissions", {
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
});


export const ProbDB = sequelize.define("problems", {
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
    type: Sequelize.ENUM("string", "special", "float", "multiple"),
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
});


export const ContDB = sequelize.define("contests", {
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
}, {
  defaultScope: {
    where: { cid: { [Sequelize.Op.gt]: 0 } }
  }
});

export const PostDB = sequelize.define("posts", {
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
});


UserDB.hasMany(SubDB, { foreignKey: "uid" });
SubDB.belongsTo(UserDB, { foreignKey: "uid" });
ProbDB.hasMany(SubDB, { foreignKey: "pid" });
SubDB.belongsTo(ProbDB, { foreignKey: "pid" });
SubDB.belongsTo(ContDB, { foreignKey: "cid" });
ContDB.hasMany(PostDB, { foreignKey: "cid" });
PostDB.belongsTo(ContDB, { foreignKey: "cid" });
PostDB.belongsTo(UserDB, { foreignKey: "uid" });

ContDB.findOrCreate({ where: { cid: 0, start: new Date(0), end: new Date(0) } });

var prob;

export async function init() {
  //UserDB.sync({ force: true });
  //SubDB.sync({ force: true });
  PostDB.sync({ force: true });
  ProbDB.sync({ force: true })
    .then(()=>ProbDB.create(prob));
  ContDB.sync({ force: true })
    .then(()=>
      ContDB.findOrCreate({ where: { cid: 0, start: new Date(0), end: new Date(0) } })
    );
}

//init();
/* eslint-disable max-len */
prob = {
  pid: 7020,
  title: "興建麻將會場",
  subtitle: "生成樹數量",
  content: `~~就像台北市辦世大運要蓋大巨蛋一樣，~~日本現在要蓋全國麻將大賽的會場
作為一個有格調的國家，主辦單位決定要完全傳統化，每個房間都是一個獨立的和式屋子，有榻榻米之類的設施讓大家可以盡情享受日式情懷
雖說這個提案聽起來很~~浪費錢~~典雅，不過現在最大的問題是各個場館的連接，因為工程的關係，現在$n$的小屋之間都有很多條被踩出來的聯外道路，
為了~~貪污~~省錢，政府決定直接從現有的道路中選取幾條整修成通道，由於不想~~像機捷一樣蓋二十年~~花太多時間，政府決定只選擇最少條來修建，且要求如下任一間屋子都可以只透過選到的路走到任一間屋子
現在政府官員想要知道，他們有幾種選擇道路的方式？由於答案可能很大，請mod $10^9+7$
順帶一提，~~由於日本人的智商高於台灣記者及台灣立委，~~保證兩間小屋只會有一條路，而且不會有從自己連到自己的路

## Input:
第一行有兩個正整數$n,m,1\\leq n\\leq 500,1\\leq m\\leq\\frac{n(n-1)}{2}$，表示小屋的數量以及路的數量
接下來$m$行每行有兩個數字$a,b,1\\leq a,b\\leq n$，表示編號$a$和$b$的小屋有路相連
## Output:
輸出一行，表示有幾種挑選路的方法滿足題意，請記得mod $10^9+7$`,
  note: "~~這題有夠毒~~",
  visibility: "visible",
  samples: JSON.parse("[[\"3 3\\n1 2\\n2 3\\n3 1\",\"3\\n\"],[\"4 5\\n1 2\\n2 3\\n3 4\\n1 3\\n2 4\",\"8\\n\"]]"),
  testSuite: JSON.parse("[{\"tid\":1,\"description\":\"$n \\\\leq 5 $\",\"score\":10,\"testcases\":[{\"tid\":1,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":2,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":3,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":4,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":5,\"timeLimit\":1000,\"memLimit\":4096}]},{\"tid\":2,\"description\":\"$n \\\\leq 50 $\",\"score\":20,\"testcases\":[{\"tid\":6,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":7,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":8,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":9,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":10,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":11,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":12,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":13,\"timeLimit\":1000,\"memLimit\":4096}]},{\"tid\":3,\"description\":\"$n \\\\leq 200$\",\"score\":20,\"testcases\":[{\"tid\":14,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":15,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":16,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":17,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":18,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":19,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":20,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":21,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":22,\"timeLimit\":1000,\"memLimit\":4096}]},{\"tid\":4,\"description\":\"$n \\\\leq 500$\",\"score\":50,\"testcases\":[{\"tid\":23,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":24,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":25,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":26,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":27,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":28,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":29,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":30,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":31,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":32,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":33,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":34,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":35,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":36,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":37,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":38,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":39,\"timeLimit\":1000,\"memLimit\":4096},{\"tid\":40,\"timeLimit\":1000,\"memLimit\":4096}]}]"),
  testMethod: "string"
};
//*/
