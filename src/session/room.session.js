import Room from "../classes/models/room.class.js";
import { roomSessions } from "./session.js";

let unusedNumbers = [];
let nextNumber = 1;

export const addRoom = (ownerId, roomName, maxUserNum) => {
    let roomId = null;

    if (unusedNumbers.length > 0) { // 숫자가 남아있으면
        roomId = unusedNumbers.pop(); // 그거 사용
      }
    // 숫자 남은게 없으면 다음 숫자 사용
    roomId = nextNumber++;
    
    const room = new Room(roomId, ownerId, roomName, maxUserNum);

    roomSessions.push(room);
    return room;
}

export const getRoomById = (roomId) => {
    return roomSessions.find((room) => room.id === roomId);
}

export const getRoomSessions = () => {
    return roomSessions;
}