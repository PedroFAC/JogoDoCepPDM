const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 8888;

io.on("connection", (socket) => {
  console.log("a user connected :D");
  socket.on("message", (cep) => {
    console.log(cep);
    io.emit("received", cep);
  });
  socket.on("clientVictory", () => {
    console.log('client victory')
    io.emit("serverDefeat");
  });
  socket.on("serverVictory", () => {
    console.log('server victory')
    io.emit("clientDefeat");
  });
  socket.on("clientDefeat", () => {
    console.log('client defeat')
    io.emit("serverVictory");
  });
  socket.on("serverDefeat", () => {
    console.log('server defeat')
    io.emit("clientVictory");
  });
  socket.on("sendServerCep", (cep) => {
    console.log(cep);
    io.emit("receiveServerCep", cep);
  });
  socket.on("sendClientCep", (cep) => {
    console.log(cep);
    io.emit("receiveClientCep", cep);
  });
  socket.on("end",()=>{
    socket.disconnect(0)
  })
});

server.listen(port, () => console.log("server running on port:" + port));
