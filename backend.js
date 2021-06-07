const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const path = require('path');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'public','/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join('some_room');
  socket.on('D',(msg)=>{
    console.log(msg);
    io.to('some_room').emit('D',msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});