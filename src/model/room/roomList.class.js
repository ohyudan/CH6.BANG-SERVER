//import roomList from '../../init/initroomlist.js';

class RoomList {
  constructor() {
    this._roomMap = new Map();
    this._roomId = 0;
  }
  getRoomList() {
    return this._roomMap;
  }
  /**
   *
   * @param {Room} room
   * @returns {bool} 성공 실패
   */
  addRoomList(room) {
    try {
      this._roomMap.set(this._roomId, room);
      this._roomId++;
      return true;
    } catch (error) {
      return false;
    }
  }
  subRoomList(room) {
    this._roomMap.delete(room.id);
  }
  get RoomId() {
    return this._roomId;
  }
  getRoom(roomid) {
    return this._roomMap.get(roomid);
  }
}
const roomList = new RoomList();
export default roomList;
