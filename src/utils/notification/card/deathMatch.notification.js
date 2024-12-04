import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import playerList from '../../../model/player/playerList.class.js';
import roomList from '../../../model/room/roomList.class.js';
import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';

const deathMatchNotification = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const targetUser = playerList.getPlayer(targetUserId.low);
  const room = roomList.getRoom(user.currentRoomId);

  const userState = user.characterData.stateInfo.state;
  const targetUserState = targetUser.characterData.stateInfo.state;
  user.setCharacterStateType(CHARACTER_STATE_TYPE.DEATH_MATCH_STATE);
  targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.DEATH_MATCH_TURN_STATE);
  // nextState는 다음 상대의 상태를 지정하는게 아니라 기존 상태를 저장하기 위함
  // 감옥 같은 특수 상태가 변경되지 않도록 지정해주는 역할을 해야함.
  user.setNextCharacterStateType(userState);
  targetUser.setNextCharacterStateType(targetUserState);
  user.setStateTargetUserId(targetUser.id);
  targetUser.setStateTargetUserId(user.id);

  user.removeHandCard(CARD_TYPE.DEATH_MATCH);
  user.characterData.handCardsCount--;

  const inGameUsers = Array.from(room.getAllPlayers().values());

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: user.id,
    targetUserId: targetUser.id,
  };

  inGameUsers.forEach((player) => {
    const gamePacket = { useCardNotification: S2CUseCardNotification };

    const useCardNotification = createResponse(
      HANDLER_IDS.USE_CARD_NOTIFICATION,
      player.socket.version,
      player.socket.sequence,
      gamePacket,
    );

    player.socket.write(useCardNotification);

    const S2CUserUpdateNotification = { user: player.getAllUsersData() };

    const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

    const userUpdateNotification = createResponse(
      HANDLER_IDS.USER_UPDATE_NOTIFICATION,
      player.socket.version,
      player.socket.sequence,
      updatePacket,
    );

    player.socket.write(userUpdateNotification);
  });

  return { succes: true, failcode: createFailCode(0) };
};

export default deathMatchNotification;
