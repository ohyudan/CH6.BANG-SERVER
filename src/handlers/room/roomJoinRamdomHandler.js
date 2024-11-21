import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../../utils/response/createFailCode.js';
import playerList from '../../model/player/playerList.class.js';
import roomJoinNotifcation from '../../utils/notification/roomJoin.notification.js';
const roomJoinRamdomHandler = async ({ socket, payload }) => {
  try {
    let success = true;
    let failCode = createFailCode(0);
    const room = roomList.getRandomWaitRoom();
    const player = playerList.getPlayer(socket.id);

    if (room == undefined) {
      success = false;
      failCode = createFailCode(8);
    } else {
      room.addPlayer(player);
    }

    const S2CJoinRandomRoomResponse = {
      success: success,
      room: room.getRoomData(),
      FailCode: failCode,
    };

    const gamePacket = {
      joinRandomRoomResponse: S2CJoinRandomRoomResponse,
    };

    const result = createResponse(
      HANDLER_IDS.JOIN_RANDOM_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    if (success == true) {
      roomJoinNotifcation(room, player);
      player.currentRoomId = room.id;
    }

    socket.write(result);
  } catch (err) {
    const S2CJoinRandomRoomResponse = {
      success: false,
      room: undefined,
      FailCode: createFailCode(5),
    };
    const gamePacket = {
      joinRandomRoomResponse: S2CJoinRandomRoomResponse,
    };

    const result = createResponse(
      HANDLER_IDS.JOIN_RANDOM_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    socket.write(result);
  }
};
export default roomJoinRamdomHandler;
// message C2SJoinRandomRoomRequest {
// }

// message S2CJoinRandomRoomResponse {
//     bool success = 1;
//     RoomData room = 2;
//     GlobalFailCode failCode = 3;
// }
