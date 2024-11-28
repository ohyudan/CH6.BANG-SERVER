import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

// 실드 검사하고 있지 않음
const bigBbangNotification = ({ socket, cardType, targetUserId }) => {
  const useCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(useCardPlayer.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();
  let failCode = null;
  let success = null;
  //const backupPlayerData = room.getAllPlayers(); // 얕은 복사 의미 없음 추후 더 고려해서 작성
  const userMakeData = [];

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: socket.id,
    targetUserId: targetUserId.low,
  };

  try {
    roomInJoinPlayerList.forEach((player) => {
      if (!(socket.id === player.id)) {
        const gamePacket = { useCardNotification: S2CUseCardNotification };

        const result = createResponse(
          HANDLER_IDS.USE_CARD_NOTIFICATION,
          player.socket.version,
          player.socket.sequence,
          gamePacket,
        );
        player.socket.write(result);
        player.decreaseHp();
      } else {
        useCardPlayer.removeHandCard(CARD_TYPE.BIG_BBANG);
      }
      userMakeData.push(player.makeRawObject());
    });

    roomInJoinPlayerList.forEach((values) => {
      const S2CUserUpdateNotification = {
        user: userMakeData,
      };
      const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };
      const result = createResponse(
        HANDLER_IDS.USER_UPDATE_NOTIFICATION,
        socket.version,
        socket.sequence,
        gamePacket,
      );
      values.socket.write(result);
    });
    success = true;
    failCode = createFailCode(0);
  } catch (err) {
    success = false;
    failCode = createFailCode(1);
  }
  return { success, failCode };
};

export default bigBbangNotification;
// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 0

// message S2CCardEffectNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     bool success = 3;
// }

// S2CUserUpdateNotification userUpdateNotification = 33;
// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }