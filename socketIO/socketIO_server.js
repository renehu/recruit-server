const { ChatModel } = require("../db/models");

module.exports = function (server) {
  // got IO object
  const io = require("socket.io")(server);

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  // monitor the connection(when a user conneted, do callback )
  io.on("connection", function (socket) {
    console.log("SoketIO connected");

    // bing sendMsg monitor, receive the client's msg
    socket.on("sendMsg", function ({ from, to, content }) {
      console.log("Server received client's msg", { from, to, content });

      // sort the from and to, then join with a "_"
      // eg:"chat_id": "625fb6d115445f292039d0c8_625fc4e115445f292039d107",
      const chat_id = [from, to].sort().join("_");

      const create_time = Date.now();
      new ChatModel({ from, to, content, chat_id, create_time }).save(function (
        err,
        chatMsg
      ) {
        // send msg to all clicents connected
        io.emit("receiveMsg", chatMsg);
      });
    });
  });
};
