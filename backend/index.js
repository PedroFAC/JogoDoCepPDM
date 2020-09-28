const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 8888;
let host = false;
io.on("connection", (socket) => {
  socket.on("serverConnect", () => {
    host = true;
    io.emit("waitingClient");
  });
  socket.on("clientConnect", () => {
    if (host) {
      io.emit("openRoom");
    }else{
      io.emit("notCreated")
    }
  });
  socket.on("message", (cep) => {
    console.log(cep);
    io.emit("received", cep);
  });
  socket.on("clientVictory", () => {
    console.log("client victory");
    io.emit("serverDefeat");
  });
  socket.on("serverVictory", () => {
    console.log("server victory");
    io.emit("clientDefeat");
  });
  socket.on("clientDefeat", () => {
    console.log("client victory");
    io.emit("serverVictory");
  });
  socket.on("serverDefeat", () => {
    console.log("server victory");
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
  socket.on("sendRace", (race) => {
    io.emit("receiveRace", race);
  });
  socket.on("end", () => {
    socket.disconnect(0);
    host = false;
  });
});

server.listen(port, () => console.log("server running on port:" + port));
