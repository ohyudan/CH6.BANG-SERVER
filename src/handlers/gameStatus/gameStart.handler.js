import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { createFailCode } from '../../utils/response/createFailCode.js';
import GameStartNotification from '../../utils/notification/gameStatus/gameStart.notification.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
//import { Packets } from '../../init/loadProtos.js';
import { getGameAssets } from '../../init/loadGameAssets.js';
import { PHASE_TYPE, ROOM_STATE } from '../../constants/room.enum.js';

const gameStartHandler = async ({ socket }) => {
  try {
    let success = true;
    let failCode = createFailCode(0);
    const gameAssets = getGameAssets();
    // 소켓을 통해 플레이어 정보 가져오기
    const ownerUser = playerList.getPlayer(socket.id);

    // 방 정보 가져오기
    const room = roomList.getRoom(ownerUser.currentRoomId);

    if (!room) {
      success = false;
      failCode = createFailCode(8); // ROOM_NOT_FOUND
    }
    if (!(room.ownerId === ownerUser.id)) {
      success = false;
      failCode = createFailCode(13); // NOT_ROOM_OWNER
    }
    // 방 상태 확인
    if (room.getState() !== ROOM_STATE.PREPARE) {
      success = false;
      failCode = createFailCode(12); // INVALID_ROOM_STATE
    }

    const characterPositions = gameAssets.characterPositionData.position;
    // 위치 정보 셔플링 및 유저 위치 설정
    const inGameUsers = Array.from(room.getAllPlayers().values());
    const selectedPositions = new Set();
    while (selectedPositions.size < inGameUsers.length) {
      const randId = Math.floor(Math.random() * characterPositions.length);
      selectedPositions.add(characterPositions[randId]);
    }

    room.startPhase();
    room.startPositionUpdate();
    const posArr = [...selectedPositions];
    inGameUsers.forEach((user, i) => {
      posArr[i].id = user.id; // 위치 ID에 유저 ID 설정
      user.updatePosition(posArr[i].x, posArr[i].y); // 유저 좌표 업데이트
    });

    room.setState(ROOM_STATE.INGAME);

    // 게임 시작 알림 전송
    GameStartNotification(room, posArr);

    // 응답 데이터 생성
    const responsePayload = {
      gameStartResponse: {
        success: success,
        failCode: failCode,
      },
    };

    // 응답 전송
    const response = createResponse(
      HANDLER_IDS.GAME_START_RESPONSE,
      socket.version,
      socket.sequence,
      responsePayload,
    );

    socket.write(response);

    console.log(`Game started successfully for room ${ownerUser.currentRoomId}`);
  } catch (err) {
    console.error('GameStartHandler Error:', err);

    const response = createResponse(
      HANDLER_IDS.GAME_START_RESPONSE,
      socket.version,
      socket.sequence,
      {
        gameStartResponse: {
          success: false,
          failCode: createFailCode(1), // UNKNOWN_ERROR
        },
      },
    );

    socket.write(response);
  }
};

export default gameStartHandler;
