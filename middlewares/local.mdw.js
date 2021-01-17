const cartModel = require("../models/cart.model");
const categoryModel = require("../models/category.model");

module.exports = function (app) {
  //transfer from req.session to res.locals so that view can get data
  app.use(async function (req, res, next) {
    if (typeof req.session.isLogin === "undefined") {
      req.session.isLogin = false;
      req.session.cart = []; //to store which item client choose and it's quantity
    }

    // console.log("in local");

    res.locals.isLogin = req.session.isLogin;
    res.locals.loggedinUser = req.session.loggedinUser;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.isInstructor = req.session.isInstructor;
    res.locals.isStudent = req.session.isStudent;
    res.locals.cartSum = cartModel.getTotalItems(req.session.cart);

    // console.log(res.locals.isInstructor + "--" + req.session.isInstructor);

    next();
  });

  app.use(async function (req, res, next) {
    const rows = await categoryModel.all();
    res.locals.listCategories = rows;
    next();
  });
};
