import HANDLER_IDS from '../../constants/handlerIds.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import { createResponse } from '../../utils/response/createResponse.js';
import cardTypeAction from './cardIndex.js';
import createFailCode from '../../utils/response/createFailCode.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import { CHARACTER_TYPE } from '../../constants/user.enum.js';

// 쉴드 미처리  사망 미처리
const useCardHandler = async ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;
  const cardActionFunction = cardTypeAction[cardType].action;
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);
  try {
    if (!cardActionFunction) {
      console.error('카드 타입이 없음');

      const S2CUseCardResponse = {
        success: false,
        failCode: createFailCode(11),
      };
      const gamePacket = {
        useCardResponse: S2CUseCardResponse,
      };
      const result = createResponse(
        HANDLER_IDS.USE_CARD_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );
      socket.write(result);
    } else {
      /**
       *  false or true 반환할 것
       *  failcode 마찬가지
       */

      const { success, failCode } = await cardActionFunction({
        socket,
        cardType,
        targetUserId,
      });

      const S2CUseCardResponse = {
        success: true, //success,
        failCode: 0, //failCode,
      };
      const gamePacket = {
        useCardResponse: S2CUseCardResponse,
      };
      const result = createResponse(
        HANDLER_IDS.USE_CARD_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );
      socket.write(result);

      //핑크군이고 핑크군의 핸드가 없을떄
      if (user.characterData.characterType === CHARACTER_TYPE.PINK &&
        user.characterData.handCards.length === 0) {
        user.addHandCard();
        user.increaseHandCardsCount();
        const S2CUserUpdateNotification = { user: user.getAllUsersData() };

        const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const userUpdateNotification = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          socket.version,
          socket.sequence,
          updatePacket,
        );

        socket.write(userUpdateNotification);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export default useCardHandler;
// message C2SUseCardRequest {
//     CardType cardType = 1;
//     int64 targetUserId = 2; // 타겟 없으면 빈 값
// }

// message S2CUseCardResponse { // 성공 여부만 반환하고 대상 유저 효과는 S2CUserUpdateNotification로 통지
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }

// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 0
// }message S2CEquipCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
// }

// message S2CCardEffectNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     bool success = 3;
// }
