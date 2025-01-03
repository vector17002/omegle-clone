import { User } from "../User/User.js";

export class RoomManager{
    addUsersToRoom(user1 : User[] , user2 : User[]){
        const roomId = this.generateRoomId(5);
        user1[0]?.socket.emit('create-offer', {to : user2[0]?.socket.id})
        return roomId
    }

    generateRoomId(length : number) : string {
        const idString : string = 'abcdefghijklmnopqrstuvwxyz123456789';
        let roomId : string = '';

        for(let i=0;i<length;i++){
            roomId += idString.charAt(Math.floor(Math.random() * idString.length));
        }
        console.log(roomId)

        return roomId;
    }
}