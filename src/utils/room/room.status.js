import { getProtoMessages } from '../../init/loadProtos.js';
const STATE = {
  WAIT: 0,
  PREPARE: 1,
  INGAME: 2,
};

/**
 *  추후 게임에셋으로 빼던가 해야됨 protoMessage
 */
class RoomStateType {
  constructor() {
    let message = getProtoMessages();
    let roomMessage = message.room.RoomStateType;
    this._stateData = {
      [STATE.WAIT]: { packet: roomMessage.room.RoomStateType.values.WAIT },
      [STATE.PREPARE]: { packet: roomMessage.room.RoomStateType.values.PREPARE },
      [STATE.INGAME]: { packet: roomMessage.room.RoomStateType.values.INGAME },
    };
    this._state = STATE.WAIT;
  }

  setState(newState) {
    if (this._stateData[newState]) {
      this._state = newState;
      console.log(`State changed to: ${newState}`);
      return true;
    }
    console.error('Invalid state change attempt.');
    return false;
  }

  /**
   *
   * @returns enum
   */
  getCurrentStateData() {
    return this._stateData[this._state];
  }
}
export { RoomStateType, STATE };
