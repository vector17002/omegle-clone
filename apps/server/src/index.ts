import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { UserManager } from './User/User.js';

// Initialize Express app
const app = express();
const server = createServer(app)
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const userManager = new UserManager();
// Handle WebSocket connection
io.on('connection', (socket) => {
  userManager.addUser(socket)

  //Handle initiate pairing
  socket.on('initiate-pairing', () => {
    userManager.initiatePairing(socket)
  })

  //Getting offer from one party
  socket.on('offer', ({to , offer}) => {
    io.to(to).emit('accept-offer', {from : socket.id , offer : offer})
  })

  //Getting answer from other party
  socket.on('offer-accepted', ({to , answer}) => {
     io.to(to).emit('accept-answer' , {from : socket.id , answer})
  })


  //Negotiation offer from one user
  socket.on('negotiation-needed', ({to , offer}) => {
    io.to(to).emit('accept-negotiation' , ({from : socket.id , offer}))
  })

  socket.on('negotiation-accepted' , ({to , answer}) => {
    io.to(to).emit('negotiation-answer-accepted' , ({answer}))
  })

  // Handle disconnects
  socket.on('disconnect', () => {
    userManager.removeUser(socket)
  });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})