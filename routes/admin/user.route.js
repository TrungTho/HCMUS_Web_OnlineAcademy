const express = require("express");
const categoryModel = require("../../models/category.model");
const router = express.Router();
const userModel = require("../../models/user.model");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const Auth = require("../../middlewares/auth.mdw");
const multer = require("multer");
const nodemailer = require("nodemailer");

router.get("/student", async function (req, res) {
  //get data from db
  const rows = await userModel.allByType(2);
  console.log(rows);

  res.render("admin/user/index", {
    categories: rows,
    isEmpty: rows.length === 0,
  });
});

router.get("/instructor", async function (req, res) {
  //get data from db
  const rows = await userModel.allByType(1);
  //console.log(rows);

  res.render("admin/user/index", {
    categories: rows,
    isEmpty: rows.length === 0,
  });
});

router.post("/change-state", async function (req, res) {
  console.log("object");
  const userid = req.body.id;
  console.log(userid);
  const ret = await userModel.disableUser(userid);
  //console.log(req.body);
  res.redirect(req.headers.referer);
});

router.get("/register", async function (req, res) {
  res.render("admin/user/register");
});

router.post("/register", async function (req, res) {
  try {
    const hashedPass = bcrypt.hashSync(req.body.PASSWORD, 10);
    const convertedDOB = moment(req.body.DOB, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );

    const newUser = {
      USERNAME: req.body.USERNAME,
      PASSWORD: hashedPass,
      DOB: convertedDOB,
      FULLNAME: req.body.FULLNAME,
      EMAIL: req.body.EMAIL,
      TYPE: 1,
      PROFILE: req.body.PROFILE,
      ISDISABLE: 0,
    };

    //add user data to db
    await userModel.add(newUser);
    console.log(newUser);

    //send email confirm
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cloneemail1104@gmail.com",
        pass: "contact1104",
      },
    });

    let otp = Math.random().toString(36).substring(7);

    let mailOptions = {
      from: "cloneemail1104@gmail.com",
      to: req.body.EMAIL,
      subject: "Youdemu confirm account",
      text:
        "You just created new instructor account on Youdemu! Your OTP is: " +
        otp,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.render("admin/user/register", {
      err_message: "Register Successfull!!!",
    });
  } catch (error) {
    res.render("admin/user/register", {
      // err_message: error,
      err_message: "Somethings wrong, please check again!!!",
    });
  }
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
