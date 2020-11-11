const express = require("express");
const RangeParser = require("range-parser");
const socket = require("socket.io");
const parser = require('./parser');
const { v4: uuidv4 } = require('uuid');

// App setup
const PORT = 8080;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

/**
  user: {
    username: string
    socket: Socket
  }
*/
let users = [];

const bots = [];

/**
 * message: {
 *  from: string
 *  content: string
 *  date: Date
 * }
 */
const messages = [];

// Static files
app.use(express.static("public"));

function getUsersForClient() {
  return users.map((u) => ({
    kind: 'user',
    id: u.id,
    name:u.name,
    desc: u.desc,
  }))
  .concat(
    bots.map((b) => ({
      kind: 'bot',
      id: b.id,
      name: b.name,
      desc: b.desc
    }))
  );
}

function refreshUsersList() {
  for (const { socket } of users) {
    socket.emit('users', getUsersForClient());
  }
}

// Socket setup
const io = socket(server);

io.on("connection", (socket) => {
  const user = {
    id: uuidv4(),
    name: socket.handshake.query.name,
    desc: socket.handshake.query.desc,
    socket: socket
  };
  users.push(user);

  refreshUsersList();

  socket.emit('messages', messages);

  socket.on('message', (messageDTO) => {
    const newMessage = {
      id: uuidv4(),
      ...messageDTO,
      date: new Date(),
    };

    messages.push(newMessage);

    io.emit('message', newMessage);
  });

  socket.on("disconnect", () => {
    const newUsers = [];
    for (const user of users) {
      if (user.socket === socket) {
        continue;
      }
      newUsers.push(user);
    }
    users = newUsers;
    refreshUsersList();
  });

  console.log("Socket connected");
});
