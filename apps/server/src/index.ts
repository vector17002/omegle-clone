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
  console.log(`User connected: ${socket.id}`);

  socket.on("connect" , () =>{
    console.log("Adding user to user list")
    userManager.addUser(socket)
  })

  //Handle initiate pairing
  socket.on('initiate-pairing', () => {
    userManager.initiatePairing(socket)
  })

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log("Removing user from user list")
    userManager.removeUser(socket)
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})