import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { addRoomList, getRoomList, subRoomList } from '../../utils/room/roomlist.js';

const roomListGetHandler = ({ socket, payload }) => {
  const S2CGetRoomListResponse = [];
  const gamePacket = {
    getRoomListResponse: S2CGetRoomListResponse,
  };
  const result = createResponse(
    HANDLER_IDS.GET_ROOM_LIST_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );
  console.log(result);
  socket.write(result);
};
export default roomListGetHandler;
// message RoomData {
//     int32 id = 1;
//     int64 ownerId = 2;
//     string name = 3;
//     int32 maxUserNum = 4;
//     RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
//     repeated UserData users = 6; // 인덱스 기반으로 턴 진행
// }
