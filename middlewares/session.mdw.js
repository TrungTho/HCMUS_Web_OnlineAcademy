const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "youdemu",
  charset: "utf8",
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
};

const sessionStore = new MySQLStore(options);

module.exports = function (app) {
  //config express-session
  app.set("trust proxy", 1); // trust first proxy
  app.use(
    session({
      secret: "SECRET_KEY",
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
        // secure: true,
      },
    })
  );
};
