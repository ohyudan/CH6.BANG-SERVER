import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE, CHARACTER_TYPE } from '../../../constants/user.enum.js';
import userUpdateNotification from '../user/userUpdate.notification.js';

const absorbNotification = async ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);
  const targetUser = playerList.getPlayer(targetUserId.low);
  const inGameUsers = Array.from(room.getAllPlayers().values());
  console.log("흡수!");
  let failCode = null;
  let success = null;

  if (targetUser.characterData.handCards.length === 0 && targetUser.characterData.weapon === 0 && targetUser.characterData.equips.length === 0) {
    const S2CUserUpdateNotification = { user: user.getAllUsersData() };

    const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

    const userUpdateNotification = createResponse(
      HANDLER_IDS.USER_UPDATE_NOTIFICATION,
      socket.version,
      socket.sequence,
      updatePacket,
    );

    socket.write(userUpdateNotification);

    success = false;
    failCode = createFailCode(11);

    return { success, failCode };
  }

  if (
    targetUser.characterData.stateInfo.state === CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE ||
    targetUser.characterData.stateInfo.state === CHARACTER_STATE_TYPE.CONTAINED
  ) {
    user.removeHandCard(CARD_TYPE.ABSORB);
    user.decreaseHandCardsCount();

    user.setNextCharacterStateType(user.characterData.stateInfo.state);
    user.setCharacterStateType(CHARACTER_STATE_TYPE.ABSORBING);
    user.setStateTargetUserId(targetUserId.low);

    targetUser.setNextCharacterStateType(targetUser.characterData.stateInfo.state);
    targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.ABSORB_TARGET);
    targetUser.setStateTargetUserId(user.id);

    //핑크군 대상일떄   
    if (targetUser.characterData.characterType === CHARACTER_TYPE.PINK &&
      targetUser.characterData.handCards.length === 1) {
      targetUser.addHandCard();
      targetUser.increaseHandCardsCount();
    }

    const S2CUseCardNotification = {
      cardType: CARD_TYPE.ABSORB,
      userId: user.id,
      targetUserId: targetUserId.low,
    };

    const gamePacket = { useCardNotification: S2CUseCardNotification };

    inGameUsers.forEach((player) => {
      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);
    });

    userUpdateNotification(room);

    success = true;
    failCode = createFailCode(0);
  } else {
    // 사용자 자신의 정보만 업데이트
    const S2CUserUpdateNotification = { user: user.getAllUsersData() };

    const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

    const userUpdateNotification = createResponse(
      HANDLER_IDS.USER_UPDATE_NOTIFICATION,
      socket.version,
      socket.sequence,
      updatePacket,
    );

    socket.write(userUpdateNotification);

    success = false;
    failCode = createFailCode(10);
  }

  return { success, failCode };
};

export default absorbNotification;
