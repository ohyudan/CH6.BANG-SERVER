import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import createFailCode from '../../utils/response/createFailCode.js';
import roomList from '../../model/room/roomList.class.js';
import playerList from '../../model/player/playerList.class.js';

const roomCreateHander = async ({ socket, payload }) => {
  const { name, maxUserNum } = payload; // 방이름 , 최대 인원
  let failCode = createFailCode(0);

  const { success, roomId } = roomList.addRoomList(socket.id, name, maxUserNum);
  let roomData;
  let ownerPlayer;

  if (!success) {
    failCode = createFailCode(4);
  } else {
    const room = roomList.getRoom(roomId);
    roomData = room.getRoomData();
    ownerPlayer = playerList.getPlayer(socket.id);
  }

  // 생성
  const S2CCreateRoomResponse = {
    success: success,
    room: roomData,
    failCode: failCode,
  };

  let gamePacket = {
    createRoomResponse: S2CCreateRoomResponse,
  };

  const result = createResponse(
    HANDLER_IDS.CREATE_ROOM_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(result); // 방 만들기
  ownerPlayer.currentRoomId = roomId;
};

export default roomCreateHander;

// message C2SCreateRoomRequest {
//   string name = 1;
//   int32 maxUserNum = 2;
// }
// message S2CCreateRoomResponse {
//     bool success = 1;
//     RoomData room = 2;
//     GlobalFailCode failCode = 3;
// }
