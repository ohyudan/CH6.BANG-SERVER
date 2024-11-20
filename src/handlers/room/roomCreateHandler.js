import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import createFailCode from '../../utils/response/createFailCode.js';
import roomList from '../../model/room/roomList.class.js';
import Room from '../../model/room/room.class.js';
import playerList from '../../model/player/playerList.class.js';

const roomCreateHander = async ({ socket, payload }) => {
  const { name, maxUserNum } = payload; // 방이름 , 최대 인원
  let failCode = createFailCode(0);
  const roomId = roomList.RoomId;
  let roomData;
  const room = new Room(roomId, socket.id, name, maxUserNum);
  const success = roomList.addRoomList(room);
  let ownerPlayer = playerList.getPlayer(socket.id);

  if (success == false) {
    failCode = createFailCode(4);
  } else {
    roomData = room.getRoomData();
  }

  // 생성
  const S2CCreateRoomResponse = {
    success: success,
    RoomData: roomData,
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

  const S2CJoinRoomNotification = {
    joinUser: ownerPlayer.UserData,
  };
  gamePacket = { joinRoomNotification: S2CJoinRoomNotification };

  const result2 = createResponse(
    HANDLER_IDS.JOIN_ROOM_NOTIFICATION,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(result); // 방 만들기
  socket.write(result2); // 나 자신 들어가기
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
