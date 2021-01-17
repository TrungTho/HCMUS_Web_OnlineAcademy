const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../../models/user.model");
const Auth = require("../../middlewares/auth.mdw");
const multer = require("multer");
const nodemailer = require("nodemailer");

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
      if (parseInt(datum.TYPE) === 0) {
        req.session.isAdmin = true;
        req.session.isInstructor = false;
        req.session.isStudent = false;
      } else if (parseInt(datum.TYPE) === 1) {
        req.session.isInstructor = true;
        req.session.isAdmin = false;
        req.session.isStudent = false;
      } else {
        req.session.isStudent = true;
        req.session.isAdmin = false;
        req.session.isInstructor = false;
      }

      console.log(parseInt(datum.TYPE));
      console.log(req.session.isAdmin);
      console.log(req.session.isStudent);
      console.log(req.session.isInstructor);

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
  //get data from req
  const username = req.query.user;
  const email = req.query.email;

  console.log(username + "--" + email);

  const datumUser = await userModel.getSingleByUsername(username);
  const datumEmail = await userModel.getSingleByEmail(email);

  if (datumUser === null) {
    if (datumEmail === null) {
      return res.json(true);
    }
  }
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
      TYPE: 2,
      PROFILE: req.body.PROFILE,
    };
    //add user data to db
    await userModel.add(newUser);

    //send email confirm
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cloneemail1104@gmail.com",
        pass: "contact1104",
      },
    });

    let otp = Math.random().toString(36).substring(7);

    var mailOptions = {
      from: "cloneemail1104@gmail.com",
      to: req.body.EMAIL,
      subject: "Youdemu confirm account",
      text: "You just created new account on Youdemu! Your OTP is: " + otp,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.render("user/vAccount/register", {
      err_message: "Register Successfull!!!",
    });
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

router.post("/changeavatar", async function (req, res) {
  //update image resource
  //create path to store avatar image file
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./resources/images/accounts/");
    },
    filename: function (req, file, cb) {
      // let filename = "111.png";
      let filename = req.session.loggedinUser.ID_USER + ".png";
      console.log(filename);
      cb(null, filename);
    },
  });

  const upload = multer({ storage });
  upload.single("avatar")(req, res, function (err) {
    if (err) {
    } else {
      // res.render("user/vAccount/profile", {
      //   userdata: req.session.loggedinUser,
      //   err_message: "Avatar changed",
      // });
      res.redirect("/account/profile");
    }
  });
});

router.post("/profile", async function (req, res) {
  try {
    //get data from user input
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

    //get user password in db to compare
    const user = await userModel.getSingle(newUser.ID_USER);

    const ret = bcrypt.compareSync(req.body.OldPassword, user.PASSWORD);
    //if old password match
    if (ret) {
      //update db data
      await userModel.update(newUser);

      //rerender view
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
