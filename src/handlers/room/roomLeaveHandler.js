import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import roomLeaveNotifcation from '../../utils/notification/room/roomLeave.notification.js';
import roomList from '../../model/room/roomList.class.js';
import playerList from '../../model/player/playerList.class.js';
import createFailCode from '../../utils/response/createFailCode.js';
const roomLeaveHandler = async ({ socket, payload }) => {
  const leaveUser = playerList.getPlayer(socket.id);
  const roomId = leaveUser.currentRoomId;
  const room = roomList.getRoom(roomId);
  try {
    if (room.ownerId === leaveUser.id) {
      const roomPlayList = room.getAllPlayers();

      roomPlayList.forEach((otherUser) => {
        roomLeaveNotifcation(room, otherUser);
        const S2CLeaveRoomResponse = { success: true, failCode: 0 };
        const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };
        const result = createResponse(
          HANDLER_IDS.LEAVE_ROOM_RESPONSE,
          socket.version,
          socket.sequence,
          gamePacket,
        );
        otherUser.socket.write(result);
        room.subPlayer(otherUser);
      });

      const S2CLeaveRoomResponse = { success: true, failCode: 0 };
      const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };
      const result = createResponse(
        HANDLER_IDS.LEAVE_ROOM_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );
      socket.write(result);
      room.subPlayer(leaveUser);
    } else {
      roomLeaveNotifcation(room, leaveUser);
      const S2CLeaveRoomResponse = { success: true, failCode: 0 };
      const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };
      const result = createResponse(
        HANDLER_IDS.LEAVE_ROOM_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );
      socket.write(result);
      room.subPlayer(leaveUser);
    }
  } catch (error) {
    const S2CLeaveRoomResponse = { success: false, failCode: createFailCode(6) };
    const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };
    const result = createResponse(
      HANDLER_IDS.LEAVE_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    socket.write(result);
  }
};

export default roomLeaveHandler;
// message C2SLeaveRoomRequest {

// }
// message S2CLeaveRoomResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }
