import HANDLER_IDS from '../../constants/handlerIds.js';
import { useVaccine } from '../../utils/card/vaccine.js';
import createFailCode from '../../utils/response/createFailCode.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const useCardHandler = ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;
  let failCode = createFailCode(0);

  try {
    // cardType에 따라 다른 로직 적용
    switch (cardType) {
      // 1 (빵야)
      // 2 (무차별난사)
      // 4 (백신)
      case 4: {
        const player = getPlayer(socket.id);
        player.removeHandCard(4);
        player.increaseHp();
        player.decreaseHandCardsCount();
        // 느낌만

        const S2CUseCardResponse = {
          succes: true,
          failCode: failCode,
        };
        const S2CUseCardNotification = {
          cardType: cardType,
          userId: socket.id,
          targetUserId: targetUserId,
        };
        const S2CCardEffectNotification = {
          cardType: cardType,
          userId: socket.id,
          succes: true,
        };
        const S2CUserUpdateNotification = {
          user: userData,
        };

        const responseGamePacket = { useCardResponse: S2CUseCardResponse };
        const notificationGamePacket = { useCardNotification: S2CUseCardNotification };
        const cardEffectNotificationGamePacket = {
          cardEffectNotification: S2CCardEffectNotification,
        };
        const userUpdateGamePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const responseResult = createResponse(
          HANDLER_IDS.USE_CARD_REQUEST,
          socket.version,
          socket.sequence,
          responseGamePacket,
        );
        const notificationResult = createResponse(
          HANDLER_IDS.USE_CARD_NOTIFICATION,
          socket.version,
          socket.sequence,
          notificationGamePacket,
        );
        const effectResult = createResponse(
          HANDLER_IDS.CARD_EFFECT_NOTIFICATION,
          socket.version,
          socket.sequence,
          cardEffectNotificationGamePacket,
        );
        const userUpdateResult = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          socket.version,
          socket.sequence,
          userUpdateGamePacket,
        );

        socket.write(responseResult);
        socket.write(notificationResult);
        socket.write(effectResult);
        socket.write(userUpdateResult);
      }

      // 5 (119호출)
      case 5: {
        const player = getPlayer(socket.id);
        player.removeHandCard(5);        
        player.decreaseHandCardsCount();
        if (targetUserId !== 0) {
        player.increaseHp();
        } else {
          // 플레이어를 제외한 모든 플레이어의 hp +1
        }
        // 느낌만

        const S2CUseCardResponse = {
          succes: true,
          failCode: failCode,
        };
        const S2CUseCardNotification = {
          cardType: cardType,
          userId: socket.id,
          targetUserId: targetUserId,
        };
        const S2CCardEffectNotification = {
          cardType: cardType,
          userId: socket.id,
          succes: true,
        };
        const S2CUserUpdateNotification = {
          user: userData,
        };

        const responseGamePacket = { useCardResponse: S2CUseCardResponse };
        const notificationGamePacket = { useCardNotification: S2CUseCardNotification };
        const cardEffectNotificationGamePacket = {
          cardEffectNotification: S2CCardEffectNotification,
        };
        const userUpdateGamePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const responseResult = createResponse(
          HANDLER_IDS.USE_CARD_REQUEST,
          socket.version,
          socket.sequence,
          responseGamePacket,
        );
        const notificationResult = createResponse(
          HANDLER_IDS.USE_CARD_NOTIFICATION,
          socket.version,
          socket.sequence,
          notificationGamePacket,
        );
        const effectResult = createResponse(
          HANDLER_IDS.CARD_EFFECT_NOTIFICATION,
          socket.version,
          socket.sequence,
          cardEffectNotificationGamePacket,
        );
        const userUpdateResult = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          socket.version,
          socket.sequence,
          userUpdateGamePacket,
        );

        socket.write(responseResult);
        socket.write(notificationResult);
        socket.write(effectResult);
        socket.write(userUpdateResult);
      }
    }
    // 6 (현피)
    // 7 (게릴라전)
    // 11 (만기적금)
    // 12 (로또당첨)
    // 13,14,15,16 (무기)
    // 17,18,19,20 (장비)
    // 21,22,23 (디버프)
    // 3 (쉴드) -
    // 8(흡수),9(신기루) 미구현
    // 10(플리마켓) 미구현
    // 해당 핸들러에서는 CharaterStateType만 지정하고 전투 처리는 캐릭터 정보 업데이트에서 한번 더 처리하는게 좋을거 같다.
  } catch (error) {
    console.log('카드 확인 중 에러 발생', error);
  }
};
