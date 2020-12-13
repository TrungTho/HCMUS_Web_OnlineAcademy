const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
  })
); //thay doi dinh dang duoi file main layout
app.set("view engine", "hbs");

app.get("/", function (req, res) {
  res.render("home");
});

//lang nghe o cong
const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
