import HANDLER_IDS from '../../constants/handlerIds.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import positionUpdateNotification from '../../utils/notification/user/positionUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

const positionUpdateHandler = ({ socket, payload }) => {
  const { x, y } = payload;

  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);

  user.updatePosition(x, y);
  positionUpdateNotification(room);

  return;
};

export default positionUpdateHandler;
