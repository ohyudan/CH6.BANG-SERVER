import { createResponse } from '../../utils/response/createResponse.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import createFailCode from '../../utils/response/createFailCode.js';
import roomList from '../../model/room/roomList.class.js';
import playerList from '../../model/player/playerList.class.js';
import roomJoinNotifcation from '../../utils/notification/room/roomJoin.notification.js';

const roomJoinHandler = async ({ socket, payload }) => {
  const { roomId } = payload;
  try {
    let success = true;
    let failCode = createFailCode(0);
    const room = roomList.getRoom(roomId);
    const player = playerList.getPlayer(socket.id);

    if (room == undefined) {
      success = false;
      failCode = createFailCode(8);
    } else {
      room.addPlayer(player);
    }

    const C2SJoinRoomRequest = {
      success: success,
      room: room.getRoomData(),
      FailCode: failCode,
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

    if (success == true) {
      roomJoinNotifcation(room, player);
      player.currentRoomId = roomId;
    }

    socket.write(result);
  } catch (err) {
    const S2CJoinRoomResponse = {
      success: false,
      room: undefined,
      FailCode: createFailCode(5),
    };
    const gamePacket = {
      joinRoomResponse: S2CJoinRoomResponse,
    };

    const result = createResponse(
      HANDLER_IDS.JOIN_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    socket.write(result);
  }
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
