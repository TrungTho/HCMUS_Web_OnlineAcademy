const express = require("express");
const router = express.Router();
const courseModel = require("../../models/course.model");
const userModel = require("../../models/user.model");

router.post("/", async function (req, res) {
  const condition = req.body.searchstring;
  const rows = await courseModel.fulltextSearch(condition);

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

    items.push({
      course,
      instructor,
      realPrice,
      isDiscount,
      isFinished,
    });
  }

  res.render("user/vCourse/search", {
    CatName: condition,
    items,
    isEmpty: items.length === 0,
  });
});

router.get("/", async function (req, res) {
  //get infor from
  const condition = req.query.searchstring;
  const isAsc = req.query.ascend;
  const isDes = req.query.descend;
  const isPriceAsc = req.query.priceascend;
  const isPriceDes = req.query.pricedescend;

  //console.log(isAsc, isDes, isPriceAsc, isPriceDes, condition);
  //collect db depends on type of filter
  let rows;
  if (isAsc) {
    rows = await courseModel.allWithAscendingCourseName(condition);
  } else if (isDes) {
    rows = await courseModel.allWithDescendingCourseName(condition);
  } else if (isPriceAsc) {
    rows = await courseModel.allWithAscendingPrice(condition);
  } else {
    rows = await courseModel.allWithDescendingPrice(condition);
  }
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

    items.push({
      course,
      instructor,
      realPrice,
      isDiscount,
      isFinished,
    });
  }

  res.render("user/vCourse/search", {
    CatName: condition,
    items,
    isEmpty: items.length === 0,
  });
});

module.exports = router;
