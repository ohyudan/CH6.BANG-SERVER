import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import playerList from '../../../model/player/playerList.class.js';
import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';

const deathMatchNotification = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const targetUser = playerList.getPlayer(targetUserId);

  user.setCharacterStateType(CHARACTER_STATE_TYPE.DEATH_MATCH_STATE);
  targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.DEATH_MATCH_TURN_STATE);

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
