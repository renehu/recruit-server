//test for mongoose
//run > node db/db_test.js

const md5 = require("blueimp-md5");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/MongoDB");

const conn = mongoose.connection;
conn.on("connected", function () {
  console.log(666);
});

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
});

const UserModel = mongoose.model("user", userSchema);

function testSave() {
  const userModel = new UserModel({
    username: "Mary",
    password: md5("234"),
    type: "employee",
  });

  userModel.save(function (error, userDoc) {
    console.log("saved", error, userDoc);
  });
}

//testSave()

function testFind() {
  const filter = { username: "Mary" };
  UserModel.find(filter, function (err, arr) {
    console.log("find", err, arr);
  });

  UserModel.findOne({ _id: "6248331a46ef80f58c6dd1fa" }, function (err, user) {
    console.log("findone", err, user);
  });
}

//testFind()

function testUpdate() {
  const filter = { _id: "6248331a46ef80f58c6dd1fa" };
  UserModel.findByIdAndUpdate(filter, { username: "Jam" }, function (err, doc) {
    console.log(err, doc);
  });
}

//testUpdate()

function testDelete() {
  UserModel.remove({ _id: "62495caaca6645d1dfc1b78b" }, function (err, doc) {
    console.log("testDelete", err, doc);
  });
}

testDelete();
