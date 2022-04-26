module.exports = function (server) {
  // got IO object
  const io = require("socket.io")(server);

  // monitor the connection(when a user conneted, do callback )
  io.on("connection", function (socket) {
    console.log("SoketIO connected");

    // bing sendMsg monitor, receive the client's msg
    socket.on("sendMsg", function (data) {
      console.log("Server received client's msg", data);

      // send msg to client(name, data)
      io.emit("receiveMsg", data.name + "_" + data.date); // send to all clients connected the server
      //socket.emit("receiveMsg", data.name + "_" + data.date);//only send to the client binded this socket
      console.log("Server send msg to client", data);
    });
  });
};
