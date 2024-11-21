//import roomList from '../../init/initroomlist.js';

import { Observer } from '../observer/observer.js';
import Room from './room.class.js';

class RoomList extends Observer {
  constructor() {
    super();
    this._roomMap = new Map();
  }
  getRoomList() {
    // 요청 받을 떄마다 하지말고 방 생성 / 방 삭제 / 인원 변경 / 상태 변경 / 에만 새로고침할 수 있지않을까.
    // -> 옵저버 패턴의 추가로 Update를 만들면 가능해졌음
    const rooms = [];
    if (this._roomMap.size <= 1) {
      this._roomMap.forEach((room) => {
        rooms.push(room.getRoomData());
      });
    }
    return rooms;
  }

  addRoomList(userId, name, maxUserNum) {
    let success;
    let roomId;
    try {
      roomId = this.getNextAvailableRoomId();
      const room = new Room(roomId, userId, name, maxUserNum);
      this._roomMap.set(room.id, room);
      room.addObserver(this);
      success = true;
      return { success, roomId };
    } catch (error) {
      success = false;
      roomId = null;
      return { success, roomId };
    }
  }
  getNextAvailableRoomId() {
    const roomIds = Array.from(this._roomMap.keys());
    roomIds.sort((a, b) => a - b);
    let nextId = 0;
    for (let id of roomIds) {
      if (id !== nextId) {
        return nextId;
      }
      nextId++;
    }
    return nextId;
  }

  subRoomList(room) {
    const bool = this._roomMap.has(room.id);
    this._roomMap.delete(room.id);
  }
  get RoomId() {
    return this._roomId;
  }
  getRoom(roomId) {
    return this._roomMap.get(roomId);
  }

  update(event, data) {
    switch (event) {
      case 'roomEmpty':
        this.subRoomList(data);
        break;
      default:
        break;
    }
  }
}
const roomList = new RoomList();
export default roomList;
