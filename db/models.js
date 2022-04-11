const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/MongoDB");
const connection = mongoose.connection;
connection.on("connected", () => {
  console.log("DB connected!");
});

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  avatar: { type: String },
  position: { type: String },
  company: { type: String },
  salary: { type: String },
  location: { type: String },
  info: { type: String },
});

const UserModel = mongoose.model("user", userSchema);

exports.UserModel = UserModel;
