const express = require("express");
const categoryModel = require("../../models/category.model");
const router = express.Router();
const courseModel = require("../../models/course.model");
const lessonModel = require("../../models/lesson.model");
const orderDetailModel = require("../../models/order-detail.model");
const userCourseModel = require("../../models/user-course.model");
const userModel = require("../../models/user.model");
const multer = require("multer");

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

router.post("/feedback", async function (req, res) {
  const ID_COURSE = req.body.ID_COURSE;
  const ID_USER = req.session.loggedinUser.ID_USER;
  const RATE = req.body.RATE;
  const FEEDBACK = req.body.FEEDBACK;

  await userCourseModel.add({ ID_COURSE, ID_USER, RATE, FEEDBACK });
  res.redirect(req.headers.referer);
});

router.post("/lesson/add", async function (req, res) {
  //add video to resourse
  const courseid = req.query.id;
  console.log(courseid);
  let filename;

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./resources/videos/" + courseid + "/");
    },
    filename: function (req, file, cb) {
      filename = file.originalname;
      console.log(filename);
      cb(null, filename);
    },
  });

  const upload = multer({ storage });
  upload.single("lessonvideo")(req, res, async function (err) {
    if (err) {
      console.log(err);
    } else {
      const lesson = {
        ID_COURSE: req.body.ID_COURSE,
        LESSONNAME: filename,
        REVIEW: req.body.REVIEW,
      };

      console.log(lesson);

      //add data to db
      await lessonModel.add(lesson);
    }
  });

  res.redirect(req.headers.referer);
});

router.get("/lesson/:id", async function (req, res) {
  const courseid = req.params.id;
  const lessonid = req.query.lessonid;

  // console.log(courseid + lessonid);

  //get all lesson of that course
  const lessons = await lessonModel.allByCourseId(courseid);

  // console.log(lessons);

  let playlesson;
  //get lesson that show in play
  if (isNaN(parseInt(lessonid))) {
    playlesson = lessons[0];
  } else {
    playlesson = await lessonModel.getSingle(lessonid);
  }

  //check that user has bought this course yet?
  let isBought = false;
  if (req.session.isLogin) {
    if (req.session.isStudent) {
      const rows = orderDetailModel.allByUserAndCourseId(
        req.session.loggedinUser.ID_USER,
        courseid
      );
      if (rows.length === 0) {
      } else {
        isBought = true;
      }
    }
  }

  //check that user is instructor that created that course?
  let canEdit = false;
  if (req.session.isLogin) {
    const course = await courseModel.getSingle(courseid);
    // console.log(course);

    //console.log(course.ID_USER + "==" + req.session.loggedinUser.ID_USER);
    if (
      parseInt(course.ID_USER) === parseInt(req.session.loggedinUser.ID_USER)
    ) {
      canEdit = true;
      isBought = true;
    }
  }

  //console.log(canEdit);

  res.render("user/vCourse/lesson", {
    lessons,
    playlesson,
    isBought,
    canEdit,
  });
});

module.exports = router;
