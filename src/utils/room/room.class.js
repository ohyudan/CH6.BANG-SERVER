import { RoomStateType, STATE } from './room.status.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { message } from 'protocol-buffers/compile.js';
/**
 * 혹시 모를 확장성 때문에 class 제작
 */
class Room {
  constructor(id, ownerId, name, maxUserNum) {
    this._id = id; // 방 아이디
    this._ownerId = ownerId;
    this._name = name;
    this._maxUserNum = maxUserNum;
    this._state = new RoomStateType();
    this._playerlist = new Map();

    let message = getProtoMessages();
    let roomDataMessage = message.room.RoomData;

    //this.addplayer(ownerId);
  }

  getRoomData() {
    // RoomData 형식에 맞게 전송 해야됨
    //return
  }

  setState(state) {
    const result = this._state.setState(state);
    return result;
  }
  getState() {
    return this._state.getCurrentStateData();
  }

  /**
   *
   * @param {Player}
   * @returns {bool} 성공 시 true  실패 시 false
   */
  addplayer(player) {
    const currentUserNumber = this._playerlist.size();
    if (this._maxUserNum <= currentUserNumber) {
      return false;
    }
    this._playerlist.set(player.id, player);
    return true;
  }
  /**
   *
   * @param {Player}
   * @returns {bool} 성공 시 true  실패 시 false
   */
  subplayer(player) {
    const currentUserNumber = this._playerlist.size();
    // 소유자가 나가면 어떻게 처리가 되는지
    // 그 외에는 id로 제거
  }
  setState(Number) {
    this._state.getCurrentStateData(Number);
  }

  getAllPlayers() {
    return this.playerlist;
  }
}

export default Room;
// message RoomData {
//     int32 id = 1;
//     string ownerId = 2;
//     string name = 3;
//     int32 maxUserNum = 4;
//     RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
//     repeated UserData users = 6; // 인덱스 기반으로 턴 진행
// }
