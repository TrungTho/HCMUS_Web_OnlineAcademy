const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../../models/user.model");
const Auth = require("../../middlewares/auth.mdw");

router.get("/login", async function (req, res) {
  if (req.headers.referer) {
    req.session.retUrl = req.headers.referer;
  }

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

      let url = req.session.retUrl || "/";
      res.redirect(url);
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
    const convertedDOB = moment(req.body.DOB, "DD/MM/YYYY").format(
      "YYYY/MM/DD"
    );
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
  const userdata = req.session.loggedinUser;
  userdata.DOB = moment(userdata.DOB, "YYYY/MM/DD").format("DD/MM/YYYY");

  //console.log(userdata);
  res.render("user/vAccount/profile", {
    userdata,
  });
});

router.post("/profile", async function (req, res) {
  try {
    const hashedPass = bcrypt.hashSync(req.body.PASSWORD, 10);
    const convertedDOB = moment(req.body.DOB, "DD/MM/YYYY").format(
      "YYYY/MM/DD"
    );
    console.log(convertedDOB);
    const newUser = {
      ID_USER: req.body.ID_USER,
      USERNAME: req.body.USERNAME,
      PASSWORD: hashedPass,
      DOB: convertedDOB,
      FULLNAME: req.body.FULLNAME,
      EMAIL: req.body.EMAIL,
      TYPE: 1,
      PROFILE: req.body.PROFILE,
    };

    //get user pass in db to compare

    const user = await userModel.getSingle(newUser.ID_USER);

    const ret = bcrypt.compareSync(req.body.OldPassword, user.PASSWORD);
    //old password match
    if (ret) {
      newUser.DOB = moment(newUser.DOB, "YYYY/MM/DD").format("DD/MM/YYYY");
      await userModel.update(newUser);
      res.render("user/vAccount/profile", {
        userdata: newUser,
        err_message: "Update Successfull!!!",
      });
    } else {
      res.render("user/vAccount/profile", {
        userdata: req.session.loggedinUser,
        err_message: "Wrong password, please type again!!!",
      });
    }
  } catch (error) {
    res.render("user/vAccount/profile", {
      userdata: req.session.loggedinUser,
      err_message: "Somethings wrong, please check again!!!",
    });
  }
});

module.exports = router;
