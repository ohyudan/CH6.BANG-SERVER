import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
//import { addRoomList, getRoomList, subRoomList } from '../../utils/room/roomlist.js';
import roomList from '../../utils/room/roomList.class.js';
const roomListGetHandler = async ({ socket, payload }) => {
  const roomMap = roomList.getRoomList();
  const roomArray = Array.from(roomMap.values());

  const S2CGetRoomListResponse = {
    rooms: [],
  };

  // 요청 받을 떄마다 하지말고 방 생성 / 방 삭제 / 인원 변경 / 상태 변경 / 에만 새로고침할 수 있지않을까.
  roomMap.forEach((room) => {
    S2CGetRoomListResponse.rooms.push(room.getRoomData());
  });

  const gamePacket = { getRoomListResponse: S2CGetRoomListResponse };
  const result = createResponse(
    HANDLER_IDS.GET_ROOM_LIST_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(result);
};
export default roomListGetHandler;
