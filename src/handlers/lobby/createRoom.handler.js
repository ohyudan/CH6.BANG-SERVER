import HANDLER_IDS from '../../constants/handlerIds.js';
import { getLobbySessions } from '../../session/lobby.session.js';
import { addRoom, getRoomSessions } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const createRoomHandler = async ({ socket, payload }) => {
  const { name, maxUserNum } = payload;

  const user = getUserBySocket(socket);
  const userId = user.id;
  const ownerId = user.nickname;

  //현재 유저가 있는 로비를 가져와야한다.
  const lobbySessions = getLobbySessions();
  const thisLobby = lobbySessions.find((lobby) =>
    lobby.users.find((user) => user.id === userId),
  );

  // 페이로드를 기반으로 룸을 생성
  const room = addRoom(ownerId, name, maxUserNum);

  // 룸을 로비에 추가
  thisLobby.addRoom(room);
  console.log(room.id);
  room.addUser(user);
  thisLobby.removeUser(userId);

  const S2CCreateRoomResponse = {
    success: true,
    room: {
      id: room.id,
      ownerId: room.ownerId,
      name: room.name,
      maxUserNum: room.maxUserNum,
      state: room.state,
      users: room.users,
    },
    failCode: 0,
  };

  const gamePacket = { createRoomResponse: S2CCreateRoomResponse };

  const createRoomResponse = createResponse(
    HANDLER_IDS.CREATE_ROOM_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(createRoomResponse);
  return;
};

export default createRoomHandler;
