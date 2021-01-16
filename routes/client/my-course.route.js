const express = require("express");
const router = express.Router();
const courseModel = require("../../models/course.model");
const orderDetailModel = require("../../models/order-detail.model");
const userModel = require("../../models/user.model");

router.get("/", async function (req, res) {
  //get id of user
  const userid = req.session.loggedinUser.ID_USER;
  //course data to bind to ui
  const items = [];

  let myCourses;
  //get course depend on type of user
  if (req.session.isStudent) {
    //get all courses of logged student
    myCourses = await orderDetailModel.allByUserId(userid);
  } else if (isInstructor) {
  }

  for (item of myCourses) {
    let course = await courseModel.getSingle(item.ID_COURSE);
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

  res.render("user/vCourse/myCourses", {
    CatName: "My courses",
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

  res.render("user/vCourse/detail", {
    product: course,
    realPrice,
    isDiscount,
    instructor,
    feedbackdata,
  });
});

router.get("/lesson/:id", async function (req, res) {
  res.render("user/vCourse/lesson", {});
});

module.exports = router;
