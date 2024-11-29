import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

const bigBnangTargetNotification = async ({ socket, player, reactionType }) => {
  //console.log(reactionType); // 0 false 1 true 왜준거야.
  try {
    const room = roomList.getRoom(player.currentRoomId);
    const roomInJoinPlayerList = room.getAllPlayers();

    player.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    player.decreaseHp();

    const userMakeData = [];

    userMakeData.push(player.makeRawObject());
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
  } catch (err) {
    console.error(err);
  }
};

export default bigBnangTargetNotification;
