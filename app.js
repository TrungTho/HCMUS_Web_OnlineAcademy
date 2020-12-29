const express = require("express");
const exphbs = require("express-handlebars");
require("express-async-errors");

const app = express();

//parser
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
  })
); //thay doi dinh dang duoi file main layout
app.set("view engine", "hbs");

app.use("/resources", express.static("public"));
// require("./middlewares/view.mdw")(app);
require("./middlewares/session.mdw")(app);
require("./middlewares/local.mdw")(app);
require("./middlewares/routes.mdw")(app);
require("./middlewares/errors.mdw")(app);

//lang nghe o cong
const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
