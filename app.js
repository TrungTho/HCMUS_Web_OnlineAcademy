const express = require("express");
require("express-async-errors");
const app = express();

//parser
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/resources", express.static("public")); //public resources for storing img, video,...
require("./middlewares/view.mdw")(app); //define express hbs
require("./middlewares/session.mdw")(app); //define express session
require("./middlewares/local.mdw")(app); //define res.locals to store data between reqs
require("./middlewares/routes.mdw")(app); //define separate route to render
require("./middlewares/errors.mdw")(app); //define error pages handle

//lang nghe o cong
const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
