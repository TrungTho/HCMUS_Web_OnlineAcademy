const express = require("express");
const router = express.Router();
const courseModel = require("../../models/course.model");
const orderDetailModel = require("../../models/order-detail.model");
const userModel = require("../../models/user.model");
const wishlistModel = require("../../models/wishlist.model");

router.get("/", async function (req, res) {
  const rows = await courseModel.allViewDes();

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

  res.render("home", {
    CatName: "My Wishlist",
    items,
    isEmpty: items.length === 0,
  });
});

router.post("/add", async function (req, res) {
  //get infor of course & user
  const courseid = +req.body.ID_COURSE;
  const userid = req.session.loggedinUser.ID_USER;

  //check if this date has existed
  const datum = await wishlistModel.allByUserAndCourseId(userid, courseid);
  if (datum.length === 0) {
    //add data to db
    await wishlistModel.add({
      ID_USER: userid,
      ID_COURSE: courseid,
    });
  }
  res.redirect(req.headers.referer);
});

router.post("/remove", async function (req, res) {
  //get infor of course & user
  const courseid = +req.body.ID_COURSE;
  const userid = req.session.loggedinUser.ID_USER;

  //get data from db to achive id_wishlist
  const datum = await wishlistModel.allByUserAndCourseId(userid, courseid);

  const delItem = {
    ID_WISHLIST: datum[0].ID_WISHLIST,
    ID_USER: userid,
    ID_COURSE: courseid,
  };

  console.log(delItem);

  //remove that row on db
  await wishlistModel.del(delItem);
  res.redirect(req.headers.referer);
});

module.exports = router;
