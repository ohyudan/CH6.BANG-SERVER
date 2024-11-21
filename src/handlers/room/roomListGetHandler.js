import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import roomList from '../../model/room/roomList.class.js';

const roomListGetHandler = async ({ socket, payload }) => {
  const rooms = roomList.getRoomList();

  const S2CGetRoomListResponse = {
    rooms: rooms,
  };

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
