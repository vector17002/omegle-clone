import { User } from "../User/User.js";

export interface Room{
    user1 : User
    user2 : User
}

export class RoomManager{
    private rooms : Map<string, Room>;

    constructor(){
        this.rooms = new Map<string,Room>();
    }
    
    addUsersToRoom(user1 : User[] , user2 : User[]){
        const roomId = this.generateRoomId(5);

        this.rooms.set(roomId,{
            //@ts-ignore
            user1 : user1[0],

            //@ts-ignore
            user2 : user2[0]
        });
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