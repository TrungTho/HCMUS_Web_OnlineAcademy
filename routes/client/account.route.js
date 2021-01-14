const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../../models/user.model");
const Auth = require("../../middlewares/auth.mdw");

router.get("/login", async function (req, res) {
  res.render("user/vAccount/login", {});
});

router.post("/login", async function (req, res) {
  const datum = await userModel.getSingleByUsername(req.body.USERNAME);

  //login information is correct!!!
  if (datum !== null) {
    const ret = bcrypt.compareSync(req.body.PASSWORD, datum.PASSWORD);
    if (ret) {
      req.session.isLogin = true;
      req.session.loggedinUser = datum;

      //check user role
      if (datum.TYPE === "0") {
        req.session.isAdmin = true;
      } else if (datum.TYPE === "1") {
        req.session.isInstructor = true;
      } else {
        req.session.isStudent = true;
      }

      console.log("role:");
      console.log(req.session.isAdmin);
      console.log(req.session.isInstructor);
      console.log(req.session.isStudent);

      res.redirect(req.originalUrl);
    }
  }

  //login information is wrong
  res.render("user/vAccount/login", {
    err_message: "Somethings wrong, please check again!!!",
  });
});

router.post("/logout", async function (req, res) {
  req.session.isLogin = false;
  req.session.loggedinUser = null;
  req.session.cart = []; //reset cart to empty when client log out

  res.redirect(req.headers.referer);
});

router.get("/is-available", async function (req, res) {
  const username = req.query.user;
  const datum = await userModel.getSingleByUsername(username);
  if (datum === null) return res.json(true);
  //console.log(datum);
  return res.json(false);
});

router.get("/register", async function (req, res) {
  res.render("user/vAccount/register");
});

router.post("/register", async function (req, res) {
  try {
    const hashedPass = bcrypt.hashSync(req.body.PASSWORD, 10);
    const convertedDOB = moment(req.body.DOB, "DD/MM/YYY").format("YYYY/MM/DD");
    // console.log(hashedPass + convertedDOB);
    const newUser = {
      USERNAME: req.body.USERNAME,
      PASSWORD: hashedPass,
      DOB: convertedDOB,
      FULLNAME: req.body.FULLNAME,
      EMAIL: req.body.EMAIL,
      TYPE: 1,
      PROFILE: req.body.PROFILE,
    };
    await userModel.add(newUser);
    // console.log(newUser);
    // console.log("hihi");
    res.render("user/vAccount/register");
  } catch (error) {
    res.render("user/vAccount/register", {
      // err_message: error,
      err_message: "Somethings wrong, please check again!!!",
    });
  }
});

router.get("/profile", Auth, async function (req, res) {
  res.render("user/vAccount/profile");
});

router.post("/profile", async function (req, res) {
  try {
    res.render("user/vAccount/profile");
  } catch (error) {
    res.render("user/vAccount/profile", {
      err_message: "Somethings wrong, please check again!!!",
    });
  }
});

module.exports = router;
