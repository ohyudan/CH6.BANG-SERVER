import HANDLER_IDS from '../../constants/handlerIds.js';
import { getLobbySessions } from '../../session/lobby.session.js';
import { getRoomSessions } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';


const getRoomListHandler = async ({ socket, payload }) => {
  // 로비가 가지고 있는 게임 룸 정보가 필요하다
  const user = getUserBySocket(socket);
  const userId = user.id;

  // 유저를 갖고 있는 로비가 가진 게임 룸
  const lobbySessions = getLobbySessions();
  console.log('1');
  console.log(lobbySessions);
  // 유저가 있는 로비
  // lobby.users 안에 있는 오브젝트 
  const lobbySession = lobbySessions.find((lobby) => 
    lobby.users.find((user) => user.id === userId));
  console.log('2');
  console.log(lobbySession);
  // 로비에 속한 방들의 정보를 모음
  const rooms = lobbySession.rooms.map((room) => {
    return {
      id: room.id,
      ownerId: room.ownerId,
      name: room.name,
      maxUserNum: room.maxUserNum,
      state: room.state,
      users: room.users,
    };
  });
  console.log('3');

  console.log('rooms 데이터 :', rooms);

  const S2CGetRoomListResponse = {
    success: 'Success',
    rooms: rooms,
    failCode: 0,
  };

  const gamePacket = { getRoomListResponse: S2CGetRoomListResponse };

  const getRoomListResponse = createResponse(
    HANDLER_IDS.GET_ROOM_LIST_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  console.log('룸 리스트 불러오기');
  console.log(getRoomListResponse);
  socket.write(getRoomListResponse);
  return;
};

export default getRoomListHandler;
