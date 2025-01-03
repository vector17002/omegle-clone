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

  // Handle disconnects
  socket.on('disconnect', () => {
    userManager.removeUser(socket)
  });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})