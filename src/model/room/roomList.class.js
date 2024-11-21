//import roomList from '../../init/initroomlist.js';

import { Observer } from '../observer/observer.js';
import Room from './room.class.js';

class RoomList extends Observer {
  constructor() {
    super();
    this._roomMap = new Map();
  }
  /**
   *
   * @returns RoomData [] 반환
   */
  getRoomList() {
    // 요청 받을 떄마다 하지말고 방 생성 / 방 삭제 / 인원 변경 / 상태 변경 / 에만 새로고침할 수 있지않을까.
    // -> 옵저버 패턴의 추가로 Update를 만들면 가능해졌음

    const roomStateList = this.getWaitStateRoom();
    const rooms = [];
    if (roomStateList.length <= 1) {
      roomStateList.forEach((room) => {
        rooms.push(room.getRoomData());
      });
    }
    return rooms;
  }
  /**
   *
   * @param {number} 유저id
   * @param {String} 방이름
   * @param {number} 최대 인원
   * @returns
   */
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
  /**
   * 없는 방 id를 찾아주는 메소드
   * @returns 없는 방 id
   */
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
  /**
   *
   * @param {Room} room
   */
  subRoomList(room) {
    this._roomMap.delete(room.id);
  }
  get RoomId() {
    return this._roomId;
  }
  /**
   *
   * @param {number} roomId
   * @returns {Room}
   */
  getRoom(roomId) {
    return this._roomMap.get(roomId);
  }

  getWaitStateRoom() {
    const result = [];
    this._roomMap.forEach((room) => {
      if (room.getState() == 0) {
        result.push(room);
      }
    });
    return result;
  }
  getRandomWaitRoom() {
    const rooms = this.getwaitStateRoom();

    if (rooms.length === 0) {
      return null; // 상태에 맞는 플레이어가 없으면 null 반환
    }

    // 랜덤으로 하나 뽑기
    const randomIndex = Math.floor(Math.random() * rooms.length);
    return rooms[randomIndex];
  }

  /**
   * 옵저버 패턴
   * @param {String} event
   * @param {Room} data
   */
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
