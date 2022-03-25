const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = [];

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    let user = userJoin(socket.id, username, room);
    socket.join(room);
    io.to(user.room).emit("roomUsers", getRoomUsers(user.room));
  });

  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    // console.log(users);
    socket.broadcast
      .to(user.room)
      .emit("message", { user: user.username, message, date: new Date() });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("disconnected", { user: user.username });
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
