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
    this._state = STATE.WAIT;
  }
  /**
   *
   * @param {number} newState
   * @returns true , false
   */
  setState(newState) {
    if (STATE[newState] !== undefined) {
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
    return this._state;
  }
}
export { RoomStateType, STATE };
