const express = require("express");
const categoryModel = require("../../models/category.model");
const router = express.Router();
const courseModel = require("../../models/course.model");
const userCourseModel = require("../../models/user-course.model");
const userModel = require("../../models/user.model");

router.get("/", async function (req, res) {
  //khong can try catch do ngoai index.js da co server error handling
  const rows = await categoryModel.all();
  //  console.log(rows);
  res.render("admin/category/category", {
    categories: rows,
    isEmpty: rows.length === 0,
  });
});

router.post("/add", async function (req, res) {
  const ret = await categoryModel.add(req.body);
  //console.log(req.body);
  res.redirect("/admin/categories");
});

router.post("/del", async function (req, res) {
  //check if del cat has had courses=> prevent del
  const courses = await courseModel.byCat(req.body.ID_CATE);
  console.log(courses);
  if (courses.length === 0) {
    const ret = await categoryModel.del(req.body);
    res.redirect("/admin/categories");
  }
  const datum = req.body;
  res.render("admin/category/edit", {
    datum,
    err_message: "Can not delete category that already has course!!!",
  });
});

router.post("/update", async function (req, res) {
  //console.log(req.body);
  const ret = await categoryModel.update(req.body);
  res.redirect("/admin/categories");
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  const datum = await categoryModel.getSingle(id);

  if (datum === null) {
    return res.redirect("/admin/categories");
  } else {
    res.render("admin/category/edit", {
      datum,
    });
  }
});

module.exports = router;
