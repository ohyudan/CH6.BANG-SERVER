import { RoomStateType, STATE } from './room.status.js';
/**
 * 혹시 모를 확장성 때문에 class 제작
 */
class Room {
  constructor(id, ownerId, name, maxUserNum) {
    this._id = id;
    this._ownerId = ownerId;
    this._name = name;
    this._maxUserNum = maxUserNum;
    this._state = new RoomStateType();
    this._playerlist = new Map();

    //this.addplayer(ownerId);
  }

  setState(state) {
    const result = this._state.setState(state);
    return result;
  }
  getState() {
    return this._state.getCurrentStateData();
  }

  addplayer(player) {
    const currentUserNumber = this._playerlist.size();
    if (this._maxUserNum <= currentUserNumber) {
      return false;
    }
    this._playerlist.set(currentUserNumber, this._id);
    return true;
  }

  subplayer(player) {}
  setState(Number) {}
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
