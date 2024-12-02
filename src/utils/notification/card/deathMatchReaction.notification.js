import { REACTION_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import roomList from '../../../model/room/roomList.class.js';
import createFailCode from '../../response/createFailCode.js';

const deathMatchReactionNotification = ({ socket, player, reactionType }) => {
  // state를 찾아서 계한테 반응이 가게끔 만들어야 함
  // user
  const user = player;
  const room = roomList.getRoom(user.currentRoomId);

  user.decreasHp();

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
};

export default deathMatchReactionNotification;
