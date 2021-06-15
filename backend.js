const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const path = require('path');
const londonmap = require('./map.json');
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
class DefaultDict {
  constructor(defaultInit) {
    return new Proxy({}, {
      get: (target, name) => name in target ?
        target[name] :
        (target[name] = typeof defaultInit === 'function' ?
          new defaultInit().valueOf() :
          defaultInit)
    })
  }
}

var room_details = new DefaultDict(Array);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'public','/index.html'));
});

app.get('/map', (req, res) => {
  res.json(londonmap);
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);

  // new user joins or a person joins a room 
  socket.on('user',(msg)=>{
    console.log(msg);
    data = JSON.parse(msg);
    var newRoomName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    if(data['roomName']!=null){
      newRoomName = data['roomName'];
    }
    socket.join(newRoomName);
    if(!room_details[newRoomName].includes(data['username'])){
      room_details[newRoomName].push({'username':data['username'],'socketid':socket.id,'nodes':[]});
    }
    var resp = {'roomName':newRoomName,'players':room_details[newRoomName]};
    io.to(newRoomName).emit('user',JSON.stringify(resp));
  });
  
  // When a detective moves, show others the movement.
  socket.on('D',(msg)=>{
    console.log(msg);
    console.log(socket.rooms);
    rooms_arr = Array.from(socket.rooms);
    io.to(rooms_arr[0]).to(rooms_arr[1]).emit('D',msg);
  });

  socket.on('start',()=>{
    var player_room = Array.from(socket.rooms)[1];
    for(var player in room_details[player_room]){
      room_details[player_room][player]['nodes'] =[ Math.floor((Math.random() * 30) + 1)];
    }
    io.to(player_room).emit('start',JSON.stringify(room_details[player_room]));
  });

  socket.on('disconnect', () => {
    var room = Array.from(socket.rooms)[1];
    for(var player in room_details[room]){
      console.log(room,room_details[room],room_details[room][player]);
      if(room_details[room][player]['socketid']==socket_id){
        room_details[room].splice(player,1);
        player_room=room;
      }
    }
    var resp = {'roomName':room,'players':room_details[room]};
    io.to(room).emit('user',JSON.stringify(resp));
    console.log(resp);
    console.log('disconnected',socket.id);
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});