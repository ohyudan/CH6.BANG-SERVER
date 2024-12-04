import { REACTION_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import playerList from '../../../model/player/playerList.class.js';
import roomList from '../../../model/room/roomList.class.js';
import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';

const deathMatchReactionNotification = ({ socket, player, reactionType }) => {
  try {
    const user = playerList.getPlayer(socket.id);
    const room = roomList.getRoom(user.currentRoomId);

    user.decreaseHp();
    user.setCharacterStateType(user.characterData.stateInfo.nextState);
    //user.setNextStateAt(0);

    const targetUser = playerList.getPlayer(user.characterData.stateInfo.stateTargetUserId);

    targetUser.setCharacterStateType(targetUser.characterData.stateInfo.nextState);
    //targetUser.setNextStateAt(0);

    const inGameUsers = Array.from(room.getAllPlayers().values());

    inGameUsers.forEach((player) => {
      const S2CUserUpdateNotification = { user: user.getAllUsersData() };

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
  } catch (error) {
    console.error('현피 리액션 진행중 에러:', error);
  }
};

export default deathMatchReactionNotification;
