const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://mastergworksinc:masterGworksinc123@cluster0.aup95.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("users");
//   // perform actions on the collection object
//   app.post('/user',(req,res)=>{

//   })
//   client.close();
// });


app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'public','/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);

  socket.on('user',(msg)=>{
    console.log(msg);
    data = JSON.parse(msg);
    var newRoomName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    if(data['roomName']!=null){
      newRoomName = data['roomName'];
    }
    socket.join(newRoomName);
    io.to(newRoomName).emit('user',newRoomName);
  });
  
  socket.on('D',(msg)=>{
    console.log(msg);
    console.log(socket.rooms);
    rooms_arr = Array.from(socket.rooms);
    io.to(rooms_arr[0]).to(rooms_arr[1]).emit('D',msg);
  });

  socket.on('disconnect', () => {
    console.log('disconnected',socket.id);
  });

});


server.listen(3000, () => {
  console.log('listening on *:3000');
});