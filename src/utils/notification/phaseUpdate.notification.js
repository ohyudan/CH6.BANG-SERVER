import HANDLER_IDS from '../../constants/handlerIds';
import { PHASE_TYPE } from '../../constants/room.enum';
import Game from '../../model/game/game.class';

/**
 * 페이즈 업데이트 알림 데이터를 생성
 * @param {Array} users 유저 리스트
 * @param {Number} phaseType 변경될 페이즈 타입
 * @param {Number} nextPhaseAt 해당 페이즈 지속시간
 * @param {Array} characterPositions 지정한 캐릭터 위치 정보
 */
export const phaseUpdateNotification = (users, phaseType, nextPhaseAt, characterPositions) => {
  users.forEach((values, key) => {
    const S2CPhaseUpdateNotification = {
      phaseType: phaseType,
      nextPhaseAt: nextPhaseAt,
      characterPositions: characterPositions,
    };
    const gamePacket = { phaseUpdateNotification: S2CPhaseUpdateNotification };
    const result = createResponse(
      HANDLER_IDS.PHASE_UPDATE_NOTIFICATION,
      values.socket.version,
      values.socket.sequence,
      gamePacket,
    );
    values.socket.write(result);
  });
};

export default phaseUpdateNotification;
// message S2CPhaseUpdateNotification {
//     PhaseType phaseType = 1; // DAY 1, EVENING 2, END 3
//     int64 nextPhaseAt = 2; // 다음 페이즈 시작 시점(밀리초 타임스탬프)
//     repeated CharacterPositionData characterPositions = 3; // 변경된 캐릭터 위치
// }
