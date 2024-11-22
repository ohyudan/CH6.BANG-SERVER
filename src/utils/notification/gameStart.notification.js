import { Packets } from '../../init/loadProtos.js';

/**
 * 게임 시작 알림 생성
 * @param {Object} room - Room 객체
 * @param {Array} characterPositions - 캐릭터 위치 데이터
 * @returns {Object} - 알림 데이터
 */
const GameStartNotification = (room, characterPositions) => {
  const notificationData = {
    gameStartNotification: {
      gameState: {
        phaseType: Packets.PhaseType.DAY, // DAY 페이즈
        nextPhaseAt: Date.now() + 180000, // 3분 후
      },
      users: room.getAllPlayers().map((player) => player.makeRawObject()), // 사용자 정보
      characterPositions: characterPositions, // 캐릭터 위치 정보
    },
  };

  // Protobuf 패킷 생성
  return notificationData;
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

// 포지션 번호
//    x      y
// 1 -3.972  3.703
// 2 10.897  4.033
// 3 11.737  -5.216
// 4 5.647   -5.126
// 5 -6.202  -5.126
// 6 -13.262  4.213
// 7 -22.742  3.653
// 8 -21.622 -6.936
// 9 -24.732 -6.886
// 10 -15.702 6.863
// 11 -1.562  6.173
// 12 -13.857 6.073
// 13 5.507   11.963
// 14 -18.252 12.453
// 15 -1.752  -7.376
// 16 21.517  -4.826
// 17 21.717  3.223
// 18 23.877  10.683
// 19 15.337 -12.296
// 20 -15.202 -4.736
