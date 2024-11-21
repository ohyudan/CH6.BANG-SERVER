import { RoomStateType, STATE } from './room.status.js';
import playerList from '../player/playerList.class.js';
import { Observable } from '../observer/observer.js';

class Room extends Observable {
  constructor(id, ownerId, name, maxUserNum) {
    super();
    this._id = id; // 방 아이디
    this._ownerId = ownerId; //-> 클라이언트에서는 배열의 순서대로 확인해서 방장을 0번일 때만 줌??? 아닌데 ?
    this._name = name;
    this._maxUserNum = maxUserNum;
    this._state = new RoomStateType();
    this._playerList = new Map();

    let ownerPlayer = playerList.getPlayer(ownerId);
    this.addPlayer(ownerPlayer);
  }
  get id() {
    return this._id;
  }
  get ownerId() {
    return this._ownerId;
  }

  getRoomData() {
    //const test = getProtoMessages();
    //let roomMessage = test.room.RoomStateType.values.WAIT;

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
  addPlayer(player) {
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
  subPlayer(player) {
    this._playerList.delete(player.id);
    if (this._playerList.size === 0) {
      this.notifyObservers('roomEmpty', this);
    }
    //return true;
  }
  getAllPlayers() {
    return this._playerList;
  }
}

export default Room;
// message RoomData {
//   int32 id = 1;
//   int64 ownerId = 2;
//   string name = 3;
//   int32 maxUserNum = 4;
//   RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
//   repeated UserData users = 6; // 인덱스 기반으로 턴 진행
// }
