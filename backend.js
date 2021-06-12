const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const { response } = require('express');
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
    if(!room_details[newRoomName].includes(data['username'])){
      room_details[newRoomName].push({'username':data['username'],'socketid':socket.id});
    }
    var resp = {'roomName':newRoomName,'players':room_details[newRoomName]};
    io.to(newRoomName).emit('user',JSON.stringify(resp));
  });
  
  socket.on('D',(msg)=>{
    console.log(msg);
    console.log(socket.rooms);
    rooms_arr = Array.from(socket.rooms);
    io.to(rooms_arr[0]).to(rooms_arr[1]).emit('D',msg);
  });

  socket.on('disconnect', () => {
    let player_room;
    for(var room in room_details){
      console.log(room,room_details[room]);
      for(var player in room_details[room]){
          console.log(room,room_details[room],room_details[room][player]);
          if(room_details[room][player]['socketid']==socket.id){
          room_details[room].splice(player,1);
          player_room=room;
        }
      }
    }
    var resp = {'roomName':player_room,'players':room_details[player_room]};
    io.to(player_room).emit('user',JSON.stringify(resp));
    console.log(resp);
    console.log('disconnected',socket.id);
  });

});


server.listen(3000, () => {
  console.log('listening on *:3000');
});