import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

const vaccineNotification = ({ socket, cardType, targetUserId }) => {
  const useCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(useCardPlayer.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();
  let failCode = null;
  let success = null;

  const userMakeData = [];

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: socket.id,
    targetUserId: socket.id,
  };

  try {
    // 카드 삭제를 먼저 수행하여 사용된 카드를 핸드에서 제거
    useCardPlayer.removeHandCard(CARD_TYPE.VACCINE);

    roomInJoinPlayerList.forEach((player) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);
      // 풀피일 때도 카드 사용이 성공해야 한다 함.
      if (socket.id === player.id) {
        player.increaseHp();
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

export default vaccineNotification;
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
