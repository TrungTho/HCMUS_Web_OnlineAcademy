const coursesCategoryModel = require("../models/courseCategory.model");

module.exports = function (app) {
  //transfer from req.session to res.locals so that view can get data
  app.use(async function (req, res, next) {
    // if (typeof req.session.isLogin === "undefined") {
    //   req.session.isLogin = false;
    //   req.session.cart = []; //to store which item client choose and it's quantity
    // }

    // res.locals.isLogin = req.session.isLogin;
    // res.locals.loggedinUser = req.session.loggedinUser;
    // res.locals.cartSum = cartModel.getTotalItems(req.session.cart);

    next();
  });

  app.use(async function (req, res, next) {
    // const rows = await categoryModel.getAllCategoryWithCount();
    // res.locals.listCategories = rows;
    next();
  });
};
