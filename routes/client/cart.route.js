const express = require("express");
const router = express.Router();
const cartModel = require("../../models/cart.model");
const courseModel = require("../../models/course.model");
const moment = require("moment");

router.get("/", async function (req, res) {
  const items = [];
  console.log(req.session.cart);
  console.log("-----------------------------");
  for (let ci of req.session.cart) {
    const datum = await courseModel.getSingle(ci);
    let realPrice = datum.PRICE;
    if (isNaN(parseInt(datum.DISCOUNT))) {
    } else {
      realPrice =
        parseInt(realPrice) -
        (parseInt(realPrice) * parseInt(datum.DISCOUNT)) / 100;
    }
    console.log(datum);
    console.log("----------------------");
    items.push({
      course: datum,
      realPrice,
    });
  }

  res.render("user/vCart/index", {
    items,
    isEmpty: req.session.cart.length === 0,
    totalMoney: await cartModel.getTotalMoney(req.session.cart),
  });
});

router.post("/add", async function (req, res) {
  const id = +req.body.ID_COURSE;

  cartModel.add(req.session.cart, id);
  res.redirect(req.headers.referer);
});

router.post("/remove", async function (req, res) {
  cartModel.del(req.session.cart, +req.body.id);
  res.redirect(req.headers.referer);
});

router.post("/confirm", async function (req, res) {
  //step 1: add data to order table
  const newOrder = {
    OrderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    UserID: req.session.loggedinUser.f_ID,
    Total: await cartModel.getTotalMoney(req.session.cart),
  };

  await orderModel.add(newOrder);
  console.log(newOrder);

  //step 2: add data to order detail table...

  //step 3: clear cart
  req.session.cart = [];
  res.redirect(req.headers.referer);
});

module.exports = router;
