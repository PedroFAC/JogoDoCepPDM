const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 8888;

io.on("connection", socket => {
  console.log("a user connected :D");
  socket.on("entrou", () => {
    console.log('entrou');
  });
});

server.listen(port, () => console.log("server running on port:" + port));
