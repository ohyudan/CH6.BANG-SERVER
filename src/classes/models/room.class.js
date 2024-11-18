import HANDLER_IDS from '../../constants/handlerIds.js';
import { roomStateType } from '../../init/loadProtos.js';
import { getUserById } from '../../session/user.session.js';
import { roomJoinNotifcation } from '../../utils/notification/room.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

class Room {
  constructor(id, ownerId, roomName, maxUserNum) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = roomName;
    this.maxUserNum = maxUserNum;
    this.state = roomStateType.WAIT;
    this.users = [];
  }
  addUser(user) {
    this.users.push(user);
  }

  joinNotificate(userId) {
    roomJoinNotifcation(this.id, userId);
  }
}

export default Room;
