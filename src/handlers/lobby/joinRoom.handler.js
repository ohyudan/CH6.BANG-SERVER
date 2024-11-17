import HANDLER_IDS from '../../constants/handlerIds';
import { getRoomSessions } from '../../session/room.session';
import { getUserBySocket } from '../../session/user.session';

const joinRoomHandler = async ({ socket, payload }) => {
  const { roomId } = payload;
  const user = getUserBySocket(socket);
  const userId = user.id;

  // 1. 페이로드로 받은 roomId에 해당하는 방의 정보를 찾고
  const roomSessions = getRoomSessions();
  const room = roomSessions.find((room) => room.id === roomId);

  // 1-1. 방에 참가한 유저 수가 현재 최대 인원에 도달해있다면 참가 불가능
  if (room.users.length >= room.maxUserNum) {
    const S2CJoinRoomResponse = {
      success: false,
      room: {
        id: room.id,
        ownerId: room.ownerId,
        name: room.name,
        maxUserNum: room.maxUserNum,
        state: room.state,
        users: room.users,
      },
      failCode: 5,
    };

    const gamePacket = { joinRoomResponse: S2CJoinRoomResponse };

    const joinRoomResponse = createResponse(
      HANDLER_IDS.JOIN_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    socket.write(joinRoomResponse);
    return;
  }

  // 2. 방에 유저를 추가
  room.addUser(user);

  // 3. 유저가 참가했음을 요청자에게 알려주고
  const S2CJoinRoomResponse = {
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

  const gamePacket = { joinRoomResponse: S2CJoinRoomResponse };

  const joinRoomResponse = createResponse(
    HANDLER_IDS.JOIN_ROOM_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(joinRoomResponse);

  // 3-1. 방에 있는 다른 유저들에게도 해당 유저의 참가를 알려준다
  const joinRoomNotfication = {
    joinUser: user, // 이렇게 되나? 확인필요함
  };

  return;
};

export default joinRoomHandler;
