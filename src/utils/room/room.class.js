import { RoomStateType, STATE } from './room.status.js';
import playerList from '../player/playerList.class.js';

class Room {
  constructor(id, ownerId, name, maxUserNum) {
    this._id = id; // 방 아이디
    this._ownerId = ownerId;
    this._name = name;
    this._maxUserNum = maxUserNum;
    this._state = new RoomStateType();
    this._playerList = new Map();

    let ownerPlayer = playerList.getPlayer(ownerId);
    this.addplayer(ownerPlayer);
  }

  getRoomData() {
    const users = [];
    this._playerList.forEach((values) => {
      users.push(values.UserData);
    });
    const RoomData = {
      id: this._id,
      ownerId: this._ownerId,
      name: this._name,
      maxUserNum: this._maxUserNum,
      state: this._state.getCurrentStateData(),
      users: users,
    };
    return RoomData;
  }
  /**
   *
   * @param {number} state
   * @returns 결과
   */
  setState(state) {
    const result = this._state.setState(state);
    return result;
  }
  /**
   *
   * @returns protobuff - enum
   */
  getState() {
    return this._state.getCurrentStateData();
  }

  /**
   *
   * @param {Player}
   * @returns {bool} 성공 시 true  실패 시 false
   */
  addplayer(player) {
    const currentUserNumber = this._playerList.size;
    if (this._maxUserNum <= currentUserNumber) {
      return false;
    }
    this._playerList.set(player.id, player);
    return true;
  }
  /**
   *
   * @param {Player}
   * @returns {bool} 성공 시 true  실패 시 false
   */
  subplayer(player) {
    const currentUserNumber = this._playerList.size;
    // 소유자가 나가면 어떻게 처리가 되는지??
    // 그 외에는 id로 제거
  }
  getAllPlayers() {
    return this._playerList;
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
