import HANDLER_IDS from '../../constants/handlerIds.js';
import { getRoomSessions } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinRoomHandler = async ({ socket, payload }) => {
  try {
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

    // 4. 방에 먼저 참가해있던 유저들에게 새로운 유저의 정보를 알려줌
    room.joinNotificate(userId);
    return;
  } catch (e) {
    console.error(e);
  }
};

export default joinRoomHandler;
