import { PHASE_TYPE } from '../../../constants/room.enum.js';
import { createResponse } from '../../response/createResponse.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
/**
 * 게임 시작 알림 생성
 * @param {Object} room - Room 객체
 * @param {Array} characterPositions - 캐릭터 위치 데이터
 * @returns {Object} - 알림 데이터
 */
const GameStartNotification = (room, characterPositions) => {
  const roomPlayList = room.getAllPlayers();
  const playerArray = [];
  roomPlayList.forEach((values, key) => {
    playerArray.push(values.makeRawObject());
  });
  roomPlayList.forEach((values, key) => {
    room.getAllPlayers();
    const S2CGameStartNotification = {
      gameState: {
        phaseType: PHASE_TYPE.DAY,
        nextPhaseAt: room._phase.nextPhaseAt,
      },
      users: playerArray, // 사용자 정보
      characterPositions: characterPositions, // 캐릭터 위치 정보
    };
    const gamePacket = { gameStartNotification: S2CGameStartNotification };

    const result = createResponse(
      HANDLER_IDS.GAME_START_NOTIFICATION,
      values.socket.version,
      values.socket.sequence,
      gamePacket,
    );
    values.socket.write(result);
  });
};

export default GameStartNotification;

// message S2CGameStartNotification {
//     GameStateData gameState = 1;
//     repeated UserData users = 2;
//     repeated CharacterPositionData characterPositions = 3;
// }

// S2CGameStartNotification gameStartNotification = 22;

// message GameStateData {
//     PhaseType phaseType = 1; // DAY 1, EVENING 2, END 3 (하루 종료시 카드 버리는 턴)
//     int64 nextPhaseAt = 2; // 다음 페이즈 시작 시점(밀리초 타임
// }
// enum PhaseType {
//   NONE_PHASE = 0;
//   DAY = 1;
//   EVENING = 2;
//   END = 3;
// }
