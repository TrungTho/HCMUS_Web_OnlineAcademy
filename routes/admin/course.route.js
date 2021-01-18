const express = require("express");
const categoryModel = require("../../models/category.model");
const router = express.Router();
const userModel = require("../../models/user.model");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const Auth = require("../../middlewares/auth.mdw");
const multer = require("multer");
const nodemailer = require("nodemailer");
const courseModel = require("../../models/course.model");

router.get("/", async function (req, res) {
  let items = [];
  const rows = await courseModel.allWithDisable();
  for (let course of rows) {
    const teacher = await userModel.getSingle(course.ID_USER);
    const cate = await categoryModel.getSingle(course.ID_CATE);

    items.push({
      course,
      teacher,
      cate,
    });
  }

  res.render("admin/course/index", {
    categories: items,
    isEmpty: rows.length === 0,
  });
});

router.post("/change-state", async function (req, res) {
  const courseid = req.body.id;
  console.log(courseid);
  const ret = await courseModel.disableCourse(courseid);
  //console.log(req.body);
  res.redirect(req.headers.referer);
});

// router.get("/:id", async function (req, res) {
//   const id = req.params.id;
//   const datum = await categoryModel.getSingle(id);

//   if (datum === null) {
//     return res.redirect("/admin/categories");
//   } else {
//     res.render("admin/category/edit", {
//       datum,
//     });
//   }
// });

module.exports = router;
