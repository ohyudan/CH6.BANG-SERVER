import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import animation from '../../response/createAnimation.js';
import { ANIMATION_TYPE } from '../../../constants/user.enum.js';

const shieldNotification = async ({ socket, cardType, targetUserId }) => {
  //console.log(cardType, targetUserId);
  const useCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(useCardPlayer.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();
  let failCode = null;
  let success = null;

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
          socket.version,
          socket.sequence,
          gamePacket,
        );

        player.socket.write(result);
      } else {
        player.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
        player.removeHandCard(CARD_TYPE.SHIELD);
        player.characterData.handCardsCount--;
      }
      userMakeData.push(player.makeRawObject());
    });

    const animationPacket = animation(socket, useCardPlayer, ANIMATION_TYPE.SHIELD_ANIMATION);

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
      //values.socket.write(animationPacket);
      values.socket.write(result);

      setTimeout(() => {
        value.socket.write(animationPacket);
      }, 2000);
    });

    success = true;
    failCode = createFailCode(0);
  } catch (err) {
    success = false;
    failCode = createFailCode(1);
  }
  return { success, failCode };
};

export default shieldNotification;
// message S2CAnimationNotification {
//   int64 userId = 1;
//   AnimationType animationType = 2;
// }
