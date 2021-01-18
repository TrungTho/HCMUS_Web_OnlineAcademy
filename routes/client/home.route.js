const express = require("express");
const categoryModel = require("../../models/category.model");
const router = express.Router();
const courseModel = require("../../models/course.model");
const orderDetailModel = require("../../models/order-detail.model");
const userModel = require("../../models/user.model");
const wishlistModel = require("../../models/wishlist.model");

router.get("/", async function (req, res) {
  let rows = await courseModel.allViewDes();

  const items = [];
  for (let course of rows) {
    //get instructor name
    let instructor = await userModel.getSingle(course.ID_USER);

    //get price after discount
    let realPrice = 0;
    let isDiscount = true;
    if (isNaN(parseInt(course.DISCOUNT)) || parseInt(course.DISCOUNT) === 0) {
      realPrice = course.PRICE;
      isDiscount = false;
    } else {
      let price = +course.PRICE,
        sale = +course.DISCOUNT;
      realPrice = price - (price * sale) / 100;
    }

    //get state finished or not
    let isFinished = false;
    if (course.DONE === 1) isFinished = true;

    // console.log(course.ID_COURSE + "--" + course.DONE + "--" + isFinished);
    items.push({
      course,
      instructor,
      realPrice,
      isDiscount,
      isFinished,
    });
  }

  //latest
  rows = await courseModel.allDateDes();

  const items2 = [];
  for (let course of rows) {
    //get instructor name
    let instructor = await userModel.getSingle(course.ID_USER);

    //get price after discount
    let realPrice = 0;
    let isDiscount = true;
    if (isNaN(parseInt(course.DISCOUNT)) || parseInt(course.DISCOUNT) === 0) {
      realPrice = course.PRICE;
      isDiscount = false;
    } else {
      let price = +course.PRICE,
        sale = +course.DISCOUNT;
      realPrice = price - (price * sale) / 100;
    }

    //get state finished or not
    let isFinished = false;
    if (course.DONE === 1) isFinished = true;

    // console.log(course.ID_COURSE + "--" + course.DONE + "--" + isFinished);
    items2.push({
      course,
      instructor,
      realPrice,
      isDiscount,
      isFinished,
    });
  }

  //feature cate
  const cates = await categoryModel.mostView();
  //console.log(cates);

  res.render("home", {
    CatName: "My Wishlist",
    items,
    isEmpty: items.length === 0,
    items2,
    cates,
  });
});

module.exports = router;
