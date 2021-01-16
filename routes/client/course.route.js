const express = require("express");
const categoryModel = require("../../models/category.model");
const router = express.Router();
const courseModel = require("../../models/course.model");
const orderDetailModel = require("../../models/order-detail.model");
const userCourseModel = require("../../models/user-course.model");
const userModel = require("../../models/user.model");

router.get("/byCat/:id", async function (req, res) {
  const catID = req.params.id;

  //check that which cat is selected
  for (const c of res.locals.listCategories) {
    if (c.CatID === +catID) {
      c.isSelected = true;
    }
  }

  const rows = await courseModel.byCat(catID);
  const category = await categoryModel.getSingle(catID);
  // console.log(catID + "--" + category);
  // console.log("----------------");
  const items = [];
  for (let course of rows) {
    let instructor = await userModel.getSingle(course.ID_USER);

    let realPrice = 0;
    let isDiscount = true;
    if (course.DISCOUNT === 0) {
      realPrice = course.PRICE;
      isDiscount = false;
    } else {
      let price = +course.PRICE,
        sale = +course.DISCOUNT;
      realPrice = price - (price * sale) / 100;
    }

    items.push({
      course,
      instructor,
      realPrice,
      isDiscount,
    });
  }

  res.render("user/vCourse/byCat", {
    CatName: category.CATENAME,
    items,
    isEmpty: items.length === 0,
  });
});

router.get("/detail/:id", async function (req, res) {
  const course = await courseModel.getSingle(req.params.id);
  if (course === null) {
    return res.redirect("/");
  }

  //calculate discount price
  let realPrice = 0;
  let isDiscount = true;
  if (course.DISCOUNT === 0) {
    realPrice = course.PRICE;
    isDiscount = false;
  } else {
    let price = +course.PRICE,
      sale = +course.DISCOUNT;
    realPrice = price - (price * sale) / 100;
  }

  //find instructor
  let instructor = await userModel.getSingle(course.ID_USER);

  //collect feedback
  const usercourse = await userCourseModel.getFeedbackWithCourseID(
    course.ID_COURSE
  );
  let feedbackdata = [];
  for (let feedback of usercourse) {
    let user = await userModel.getSingle(feedback.ID_USER);
    //console.log(user);
    feedbackdata.push({
      feedback,
      user,
    });
  }

  //check that logged user has bought this course or not
  let isBought = false;
  if (req.session.isLogin) {
    const orderdetail = await orderDetailModel.allByUserAndCourseId(
      req.session.loggedinUser.ID_USER,
      req.params.id
    );

    if (orderdetail.length === 0) {
    } else {
      isBought = true;
    }
  }
  console.log(isBought);
  res.render("user/vCourse/detail", {
    product: course,
    realPrice,
    isDiscount,
    instructor,
    feedbackdata,
    isBought,
    isLogin: req.session.isLogin,
  });
});

router.get("/lesson/:id", async function (req, res) {
  res.render("user/vCourse/lesson", {});
});

module.exports = router;
