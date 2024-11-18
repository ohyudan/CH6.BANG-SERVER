import HANDLER_IDS from '../../constants/handlerIds.js';
import { getLobbySessions } from '../../session/lobby.session.js';
import { getRoomById } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinRandomRoomHandler = ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const userId = user.id;

    // 1. 로비에 있는 rooms에서 입장 가능한 조건(룸 안에 있는 유저 수가 maxUserNum보다 적을 때) 만족한 room의 번호, roomId를 가져와야함.
    const lobbySessions = getLobbySessions();
    const thisLobby = lobbySessions.find((lobby) => lobby.users.find((user) => user.id === userId));

    // 1-1. 로비를 찾았으면 조건에 해당하는 방들의 리스트를 찾고 roomId를 저장한다.
    const availableRoomsList = thisLobby.rooms.filter((room) => room.users.length < room.maxUserNum).map((room) => room.id);

    // 2. 입장가능한 방이 없으면 컷
    if (!availableRoomsList) {
      const S2CJoinRandomRoomResponse = {
        success: false,
        room: {},
        failCode: 5,
      };

      const gamePacket = { joinRandomRoomResponse: S2CJoinRandomRoomResponse };

      const joinRandomRoomResponse = createResponse(
        HANDLER_IDS.JOIN_RANDOM_ROOM_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );

      socket.write(joinRandomRoomResponse);
      return;
    }

    // 3. 찾아낸 방들의 리스트 중에서 랜덤으로 하나 선택
    const randomRoomId = availableRoomsList[Math.floor(Math.random()*availableRoomsList.length)];

    // 3-1. 리스트에 해당하는 roomId를 사용해 해당 룸 정보를 가져옴
    const findRoom = getRoomById(randomRoomId);

    // 3-2. 방에 유저를 추가
    findRoom.addUser(user);

    // 4. 유저가 참가했음을 요청자에게 Response 전달
    const S2CJoinRandomRoomResponse = {
      success: true,
      room: findRoom,
      failCode: 0,
    };

    const gamePacket = { joinRandomRoomResponse: S2CJoinRandomRoomResponse };

    const joinRandomRoomResponse = createResponse(
      HANDLER_IDS.JOIN_RANDOM_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    socket.write(joinRandomRoomResponse);

    // 5. 방의 기존 유저들에게 알림
    findRoom.joinNotificate(userId);
    return;
  } catch (e) {
    console.error(e);
  }
};

export default joinRandomRoomHandler;
