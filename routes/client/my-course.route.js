const express = require("express");
const router = express.Router();
const courseModel = require("../../models/course.model");
const orderDetailModel = require("../../models/order-detail.model");
const userModel = require("../../models/user.model");
const categoryModel = require("../../models/category.model");
const moment = require("moment");

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
  } else if (req.session.isInstructor) {
    myCourses = await courseModel.allByInstructorId(
      req.session.loggedinUser.ID_USER
    );
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

router.get("/add", async function (req, res) {
  const categories = await categoryModel.all();
  //console.log(moment().format("DD/MM/YYYY"));
  res.render("instructor/vCourse/new-course", {
    categories,
    user: req.session.loggedinUser,
    today: moment().format("DD/MM/YYYY"),
  });
});

router.post("/add", async function (req, res) {
  // console.log(req.body);
  let course = {
    ID_USER: req.session.loggedinUser.ID_USER,
    ID_CATE: +req.body.ID_CATE,
    COURSENAME: req.body.COURSENAME,
    COURSELENGTH: +req.body.COURSELENGTH,
    CREATEDATE: moment(req.body.CREATEDATE, "DD/MM/YYYY").format("YYYY-MM-DD"),
    LASTUPDATE: moment(req.body.CREATEDATE, "DD/MM/YYYY").format("YYYY-MM-DD"),
    PRICE: req.body.PRICE,
    VIEWED: 0,
    SHORTDES: req.body.SHORTDES,
    DESCRIPTION: req.body.DESCRIPTION,
    DISCOUNT: +req.body.DISCOUNT,
    DONE: +req.body.DONE,
    ISDISABLE: 0,
  };

  // console.log(course);
  let categories;
  try {
    await courseModel.add(course);
    err_message = "Save Successfully!!!";
    categories = await categoryModel.all();
  } catch (error) {
    err_message = "Somethings wrong, please check again!!!";
    categories = course;
  }

  res.render("instructor/vCourse/new-course", {
    categories,
    user: req.session.loggedinUser,
    today: moment().format("DD/MM/YYYY"),
    err_message,
  });
});

router.post("/update", async function (req, res) {
  // console.log(req.body);
  let course = {
    ID_COURSE: req.body.ID_COURSE,
    ID_USER: req.session.loggedinUser.ID_USER,
    ID_CATE: +req.body.ID_CATE,
    COURSENAME: req.body.COURSENAME,
    COURSELENGTH: +req.body.COURSELENGTH,
    LASTUPDATE: moment(req.body.CREATEDATE, "DD/MM/YYYY").format("YYYY-MM-DD"),
    PRICE: req.body.PRICE,
    VIEWED: 0,
    SHORTDES: req.body.SHORTDES,
    DESCRIPTION: req.body.DESCRIPTION,
    DISCOUNT: +req.body.DISCOUNT,
    DONE: +req.body.DONE,
    ISDISABLE: 0,
  };

  console.log(course);
  let categories;
  try {
    await courseModel.update(course);
    err_message = "Save Successfully!!!";
    categories = await categoryModel.all();
  } catch (error) {
    err_message = "Somethings wrong, please check again!!!";
    categories = course;
  }

  res.render("instructor/vCourse/new-course", {
    categories,
    user: req.session.loggedinUser,
    today: moment().format("DD/MM/YYYY"),
    err_message,
  });
});

router.get("/edit/:id", async function (req, res) {
  const courseid = req.params.id;

  const course = await courseModel.getSingle(courseid);
  const categories = await categoryModel.all();

  res.render("instructor/vCourse/new-course", {
    categories,
    user: req.session.loggedinUser,
    today: moment().format("DD/MM/YYYY"),
    course,
    isUpdate: true,
  });
});

module.exports = router;
