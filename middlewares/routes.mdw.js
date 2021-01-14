// const isAuth = require("./auth.mdw");

module.exports = function (app) {
  //tao ra tai nguyen web
  //req - request tu client, res - response tu server
  app.get("/", (req, res) => {
    res.render("home");
  });

  app.use("/admin/categories", require("../routes/admin/category.route"));
  //app.use("/admin/products", require("../routes/admin/product.route"));
  app.use("/course", require("../routes/client/course.route"));
  // app.use("/account", require("../routes/client/account.route"));
  // app.use("/cart", isAuth, require("../routes/client/cart.route"));
};
