const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const config = require("./config");
//mongoose.connect("mongodb://localhost:27017/MongoDB");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const logger = require("../utils/logger");

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("DB connected!");
  //logger.info("DB conected.");
});

// user
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
  create_time: { type: Number },
});

const UserModel = mongoose.model("user", userSchema);
exports.UserModel = UserModel;

// chat
const chatSchema = mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  chat_id: { type: String, required: true }, //from a to b or from b to a, string with '_' after sort
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  create_time: { type: Number },
});

const ChatModel = mongoose.model("chat", chatSchema);
exports.ChatModel = ChatModel;
