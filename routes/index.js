// all API here

var express = require("express");
const { UserModel, ChatModel } = require("../db/models");
const md5 = require("blueimp-md5");

var router = express.Router();

const filter = { password: 0, __v: 0 }; // filter password value

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* User API */
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

/* Chat API */
// get msg list, userid from cookie, return user obj and chatMsg array
router.get("/api/msglist", function (req, res) {
  // find all users and put in users obj
  UserModel.find(function (err, userDocs) {
    // arr.focEach way
    const users = {}; // userDocs is arrary, so we need a new object to put result
    userDocs.forEach((userDoc) => {
      // forEach executes a provided function once for each array element.
      users[userDoc._id] = {
        username: userDoc.username,
        avatar: userDoc.avatar,
      };
    });

    // arr.reduce way
    // const users = userDocs.reduce((users, userDoc) => {
    //   users = users[userDoc._id] = {
    //     username: userDoc.username,
    //     avatar: userDoc.avatar,
    //   };
    //   return users;
    // }, {});

    // find all chats this userid related whether from or to
    const userid = req.cookies.userid;

    ChatModel.find(
      {
        $or: [{ from: userid }, { to: userid }],
      },
      filter,
      function (err, chatMsgs) {
        res.send({ code: 0, data: { users, chatMsgs } });
      }
    );
  });
});

// mark msg as read
router.post("/api/msgread", function (req, res) {
  const from = req.body.from;
  const to = req.cookies.userid;

  ChatModel.updateMany(
    { from, to, read: false },
    { read: true },
    { multi: true },
    function (err, doc) {
      console.log("/api/msgread:", doc);
      res.send({ code: 0, data: doc.nModified ?? null });
    }
  );
});

module.exports = router;
