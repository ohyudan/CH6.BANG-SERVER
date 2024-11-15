import { addUser } from "../../session/user.session.js";


class Room {
  constructor(id, ownerId, roomName, maxUserNum) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = roomName;
    this.maxUserNum = maxUserNum;
    this.state = 0;
    this.users = [];
  }
  addUser(user) {
    this.users.push(user);
  }
}



export default Room;