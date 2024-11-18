import { addRoomList, getRoomList, subRoomList } from '../../utils/room/roomlist.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
import Room from '../../utils/room/room.class.js';
const roomCreateHander = ({ socket, payload }) => {
  const { name, MaxUserNum } = payload;

  const room = new Room(0);

  const S2CCreateRoomResponse = {
    success: true, // 추후 변수 할당
    RoomData: null,
    failCode: failCodeReturn(0),
  };

  const gamePacket = {
    createRoomResponse: S2CCreateRoomResponse,
  };

  const result = createResponse(
    HANDLER_IDS.CREATE_ROOM_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(result);
};

export default roomCreateHander;

// message S2CCreateRoomResponse {
//     bool success = 1;
//     RoomData room = 2;
//     GlobalFailCode failCode = 3;
// }
