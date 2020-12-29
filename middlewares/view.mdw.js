const exphbs = require("express-handlebars");
const numeral = require("numeral");
const hbs_sections = require("express-handlebars-sections");

module.exports = function (app) {
  app.engine(
    "hbs",
    exphbs({
      defaultLayout: "main",
      extname: ".hbs",
      helpers: {
        section: hbs_sections(),
        format(val) {
          return numeral(val).format("0,0");
        },
      },
    })
  ); //thay doi dinh dang duoi file main layout
  app.set("view engine", "hbs");
};
