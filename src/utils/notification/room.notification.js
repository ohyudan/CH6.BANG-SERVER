import { createResponse } from '../response/createResponse.js';
import HANDLER_IDS from '../../constants/handlerIds.js';

/**
 *
 * @param {Room} 해당 방
 * @param {Player} 들어온 플레이어
 */
export const roomJoinNotifcation = (room, newuser) => {
  const roomPlayList = room.getAllPlayers();

  roomPlayList.forEach((values, key) => {
    if (newuser.id !== key) {
      const S2CJoinRoomNotification = {
        joinUser: newuser.UserData,
      };
      const gamePacket = { joinRoomNotification: S2CJoinRoomNotification };

      const result = createResponse(
        HANDLER_IDS.JOIN_ROOM_NOTIFICATION,
        values.socket.version,
        values.socket.sequence,
        gamePacket,
      );

      values.socket.write(result);
    }
  });
};
export default roomJoinNotifcation;
// message S2CJoinRoomNotification {
//     UserData joinUser = 1;
// }
