import { Socket } from "socket.io";

export class User {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }
    
    getSocket(){
        return this.socket
    }
}

export class UserManager{
    private users: User[];
    private queue: string[];
    
    constructor(){
        this.users = [];
        this.queue = [];
    }

    addUser(socket:  Socket){
        this.users.push(new User(socket))
    }

    removeUser(socket : Socket){
     const userIndex = this.users.findIndex(user => user.getSocket().id === socket.id)
     if(userIndex !== -1) 
        this.users.splice(userIndex, 1)
     const queueIndex = this.queue.findIndex(userId => userId === socket.id)
     if(queueIndex !== -1)
        this.queue.splice(queueIndex,1)
    }
    
    initiatePairing(socket : Socket){
        this.queue.push(socket.id)
        socket.emit("send-to-lobby")
    }
}