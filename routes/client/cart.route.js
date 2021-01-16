const express = require("express");
const router = express.Router();
const cartModel = require("../../models/cart.model");
const courseModel = require("../../models/course.model");
const moment = require("moment");
const orderModel = require("../../models/order.model");
const orderDetailModel = require("../../models/order-detail.model");

router.get("/", async function (req, res) {
  const items = [];
  for (let ci of req.session.cart) {
    const datum = await courseModel.getSingle(ci);
    let realPrice = datum.PRICE;
    let realDiscount = 0;
    if (isNaN(parseInt(datum.DISCOUNT))) {
    } else {
      realPrice =
        parseInt(realPrice) -
        (parseInt(realPrice) * parseInt(datum.DISCOUNT)) / 100;
      realDiscount = parseInt(datum.DISCOUNT);
    }

    items.push({
      course: datum,
      realPrice,
      realDiscount,
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
    ORDERDATE: moment().format("YYYY-MM-DD HH:mm:ss"),
    ID_USER: req.session.loggedinUser.ID_USER,
    TOTAL: await cartModel.getTotalMoney(req.session.cart),
  };

  await orderModel.add(newOrder);
  //console.log(newOrder);

  //step 2: add data to order detail table from cart
  for (let id of req.session.cart) {
    //get course to get price
    let datum = await courseModel.getSingle(id);
    //calculate realprice
    let realPrice;
    if (!datum.PRICE) {
      realPrice = 0;
    } else {
      realPrice = parseInt(datum.PRICE);
    }

    if (isNaN(parseInt(datum.DISCOUNT))) {
    } else {
      realPrice =
        parseInt(realPrice) -
        (parseInt(realPrice) * parseInt(datum.DISCOUNT)) / 100;
    }
    //init new detail order row
    let detail = {
      ID_ORDER: newOrder.ID_ORDER,
      ID_USER: req.session.loggedinUser.ID_USER,
      ID_COURSE: id,
      AMOUNT: realPrice,
    };

    //add new row to db
    await orderDetailModel.add(detail);
  }
  //step 3: clear cart
  req.session.cart = [];
  res.redirect(req.headers.referer);
});

module.exports = router;
