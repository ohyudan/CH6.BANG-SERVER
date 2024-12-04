import HANDLER_IDS from '../../../constants/handlerIds.js';
import { createResponse } from '../../response/createResponse.js';

export const roomLeaveNotifcation = (room, leaveUser) => {
  const roomPlayList = room.getAllPlayers();

  roomPlayList.forEach((values, key) => {
    if (leaveUser.id !== key) {
      const S2CLeaveRoomNotification = {
        userId: leaveUser.id,
      };
      const gamePacket = { leaveRoomNotification: S2CLeaveRoomNotification };
      const result = createResponse(
        HANDLER_IDS.LEAVE_ROOM_NOTIFICATION,
        values.socket.version,
        values.socket.sequence,
        gamePacket,
      );
      values.socket.write(result);
    }
  });
};
export default roomLeaveNotifcation;
// message S2CLeaveRoomNotification {
//     int64 userId = 1;
// }
