import Lobby from "../classes/models/lobby.class.js";
import { lobbySessions } from "./session.js";

let unusedNumbers = [];
let nextNumber = 1;

export const addLobby = () => {
    let lobbyId = null;

    if (unusedNumbers.length > 0) { // 숫자가 남아있으면
        lobbyId = unusedNumbers.pop(); // 그거 사용
      }
    // 숫자 남은게 없으면 다음 숫자 사용
    lobbyId = nextNumber++;

    const lobby = new Lobby(lobbyId);
    lobbySessions.push(lobby);
    return lobby;
}

export const findUnfilledLobby = () => {
    const unfilledLobby = lobbySessions.find((lobby) => lobby.state === 'unfilled');
    return unfilledLobby;
}

export const removeLobby = (id) => {
    const lobbyIndex = lobbySessions.findIndex((lobby) => lobby.id === id);
    unusedNumbers.push(id); // 사용이 끝난 숫자를 반납
    if (lobbyIndex !== -1) {
        lobbySessions[lobbyIndex].intervalManager.removeLobby(lobbySessions[lobbyIndex].id);
        return lobbySessions.splice(lobbyIndex, 1)[0];
    }
}

export const getLobby = (id) => { 
    // 로비id로 로비 검색하기
    return lobbySessions.find((lobby) => lobby.id === id);
}

// export const getLobbybySocket = (socket) => {
//     return lobbySessions.find((lobby) => )
// }

export const getLobbySessions = () => {
    return lobbySessions;
}

export const getLobbyByUserId = (userId) => {
    return lobbySessions.find((lobby) => lobby.users.find((user) => user.id === userId));
}

export const getLobbyByRoomId = (roomID) => {
    return lobbySessions.find((lobby) => lobby.rooms.find((room) => room.id === roomID));
}