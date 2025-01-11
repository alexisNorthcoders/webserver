const http = require("http");
const socketIo = require("socket.io");
const { app } = require("./server");
const server = http.createServer(app);

const io = socketIo(server)

let players = {}

io.on('connection', (socket) => {
    let player = ''
    //console.log(`User connected: ${socket.id}`);
    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    socket.on('playerMovement', (movementData) => {
        console.log(movementData, socket.id, player)
        console.log(players)
        if (players[socket.id]) {
          players[socket.id].direction = movementData.direction;
    
          io.emit('playerMoved', { id: socket.id, ...players[socket.id] });
        }
      });

    socket.on('newPlayer', (playerName)=>{
      player = playerName
      players[socket.id] = player
      console.log(`${playerName} joined the game.`)
    })
    socket.on('disconnect', () => {
        console.log(`${ player } disconnected.`);
    });
  });

  module.exports= { server }