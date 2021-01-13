const express = require("express");
const router = express.Router();
const productModel = require("../../models/course.model");
const userModel = require("../../models/user.model");

router.get("/byCat/:id", async function (req, res) {
  const catID = req.params.id;

  //check that which cat is selected
  for (const c of res.locals.listCategories) {
    if (c.CatID === +catID) {
      c.isSelected = true;
    }
  }

  const rows = await productModel.byCat(catID);
  const items = [];

  for (let course of rows) {
    let instructor = await userModel.getSingle(course.ID_USER);
    items.push({
      course,
      instructor,
    });
  }

  res.render("user/vProduct/byCat", {
    items,
    isEmpty: items.length === 0,
  });
});

router.get("/detail/:id", async function (req, res) {
  const datum = await productModel.getSingle(req.params.id);
  if (datum === null) {
    return res.redirect("/");
  }

  res.render("vProduct/detail", {
    product: datum,
  });
});

module.exports = router;
