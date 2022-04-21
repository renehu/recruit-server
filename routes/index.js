// all API here

var express = require("express");
const { UserModel } = require("../db/models");
const md5 = require("blueimp-md5");

var router = express.Router();

const filter = { password: 0, __v: 0 }; // filter password value

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/api/register", function (req, res, next) {
  const { username, password, type } = req.body;

  UserModel.findOne({ username }, function (err, userDoc) {
    if (userDoc) {
      res.send({ code: 1, msg: "The user already exists" });
    } else {
      new UserModel({ username, type, password: md5(password) }).save(function (
        error,
        userDoc
      ) {
        res.cookie("userid", userDoc._id, { maxAge: 1000 * 60 * 60 * 24 }); //1 day
        const data = { username, type, _id: userDoc._id };
        res.send({ code: 0, data: data });
      });
    }
  });
});

router.post("/api/login", function (req, res) {
  const { username, password } = req.body;

  UserModel.findOne(
    { username, password: md5(password) },
    filter,
    function (err, userDoc) {
      if (userDoc) {
        res.cookie("userid", userDoc._id, { maxAge: 1000 * 60 * 60 * 24 }); //1 day

        const data = userDoc;
        res.send({ code: 0, data: data });
      } else {
        res.send({ code: 1, msg: "Username or password error" });
      }
    }
  );
});

router.post("/api/update", function (req, res) {
  // get userid from cookie
  const userid = req.cookies.userid;

  if (!userid) {
    return res.send({ code: 1, msg: "Please login" });
  }

  const user = req.body;

  UserModel.findByIdAndUpdate(
    { _id: userid },
    user,
    function (err, originalUserDoc) {
      if (!originalUserDoc) {
        //if the database has been tampered, clear the cookie
        res.clearCookie("userid");
        res.send({ code: 1, msg: "Please login" });
      } else {
        const { _id, username, type } = originalUserDoc;
        // combine the props
        const data = Object.assign(user, { _id, username, type });
        res.send({ code: 0, data: data });
      }
    }
  );
});

router.get("/api/user", function (req, res) {
  const userid = req.cookies.userid;

  if (!userid) {
    return res.send({ code: 1, msg: "Please login" });
  }

  UserModel.findOne({ _id: userid }, filter, function (err, userDoc) {
    if (userDoc) {
      res.send({ code: 0, data: userDoc });
    } else {
      res.send({ code: 1, msg: `${err}` });
    }
  });
});

router.get("/api/userlist", function (req, res) {
  const { type } = req.query;
  UserModel.find({ type }, filter, function (err, userDocArray) {
    res.send({ code: 0, data: userDocArray });
  });
});

module.exports = router;
