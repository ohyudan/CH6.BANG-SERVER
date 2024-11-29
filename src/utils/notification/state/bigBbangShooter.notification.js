import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

const bigBnangShooterNotification = ({ socket, player }) => {
  const room = roomList.getRoom(player.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();

  const userMakeData = [];

  roomInJoinPlayerList.forEach((values) => {
    if (values.id == player.id) {
      values.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    }
    userMakeData.push(values.makeRawObject());
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
};

export default bigBnangShooterNotification;
// 이걸로 는 안되고...
