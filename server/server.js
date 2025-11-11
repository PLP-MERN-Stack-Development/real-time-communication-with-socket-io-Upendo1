const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let users = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins with username
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userList', Object.values(users));
    io.emit('notification', `${username} joined the chat`);
  });

  // Chat message
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  // Typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  // Disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('userList', Object.values(users));
    if (username) {
      io.emit('notification', `${username} left the chat`);
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
