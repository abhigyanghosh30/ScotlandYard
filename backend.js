const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const path = require('path');

const server = http.createServer(app);
app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'public','/index.html'));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});