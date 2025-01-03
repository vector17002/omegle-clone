import { Socket } from "socket.io";
import { RoomManager } from "../Room/Room.js";

export interface User {
   socket: Socket;
}

export class UserManager{
    private users: User[];
    private queue: string[];
    private roomManager : RoomManager;
    
    constructor(){
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(socket:Socket){
        this.users.push({
            socket: socket
        })
    }

    removeUser(socket : Socket){
     const userIndex = this.users.findIndex(user => user.socket.id === socket.id)
     if(userIndex !== -1) 
        this.users.splice(userIndex, 1)
     const queueIndex = this.queue.findIndex(userId => userId === socket.id)
     if(queueIndex !== -1)
        this.queue.splice(queueIndex,1)
    }
    
    initiatePairing(socket : Socket){
        this.queue.push(socket.id)
        this.sendUserToRoom()
    }

    sendUserToRoom(){
        if(this.queue.length < 2){
            console.log("Not enough users in the queue")
            return;
        }

        const id1 = this.queue.pop()
        const id2 = this.queue.pop()

        if(id1 === id2)
            return;

        const user1 = this.users.filter(x => x.socket.id === id1)
        const user2 = this.users.filter(x => x.socket.id === id2)

        if(!user1 || !user2)
            return;

        const room = this.roomManager.addUsersToRoom(user1 , user2);
        user1[0]?.socket.emit('send-to-room', {room : room});
        user2[0]?.socket.emit('send-to-room', {room : room})
    }

}