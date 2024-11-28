import HANDLER_IDS from '../../constants/handlerIds';
import { createResponse } from '../response/createResponse';

/**
 * 게임 시작 알림 생성
 * @param {Array} playerList 플레이어 리스트
 * @param {Object} returns 알람 데이터
 */
const userUpdateNotification = (playerList) => {
  const playerArray = [];

  playerList.forEach((values, key) => {
    playerArray.push(values.makeRawObject());
  });

  playerList.forEach((values, key) => {
    const S2CUserUpdateNotification = {
      users: playerArray,
    };
    const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };

    const result = createResponse(
      HANDLER_IDS.USER_UPDATE_NOTIFICATION,
      values.socket.version,
      values.socket.sequence,
      gamePacket,
    );
    values.socket.write(result);
  });
};

export default userUpdateNotification;

// message UserData {
//     int64 id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }

// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }
