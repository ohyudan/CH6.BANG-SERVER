import { createResponse } from '../../utils/response/createResponse.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import createFailCode from '../../utils/response/createFailCode.js';
import roomList from '../../model/room/roomList.class.js';
import playerList from '../../model/player/playerList.class.js';
import roomJoinNotifcation from '../../utils/notification/room.notification.js';
// 에러 처리 필요
const roomJoinHandler = async ({ socket, payload }) => {
  const { roomId } = payload;
  const room = roomList.getRoom(roomId);
  const player = playerList.getPlayer(socket.id);
  room.addplayer(player);

  const C2SJoinRoomRequest = {
    success: true,
    room: room.getRoomData(),
    FailCode: createFailCode(0),
  };
  const gamePacket = {
    joinRoomResponse: C2SJoinRoomRequest,
  };

  const result = createResponse(
    HANDLER_IDS.JOIN_ROOM_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );
  socket.write(result);
  roomJoinNotifcation(room, player);
};

export default roomJoinHandler;
// message C2SJoinRoomRequest {
//     int32 roomId = 1;
// }

// message S2CJoinRoomResponse {
//     bool success = 1;
//     RoomData room = 2;
//     GlobalFailCode failCode = 3;
// }
