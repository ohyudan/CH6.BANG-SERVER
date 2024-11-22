import { ROOM_STATE } from '../../constants/room.enum.js';
class RoomStateType {
  constructor() {
    this._currentState = ROOM_STATE.WAIT;
  }

  set currentState(newState) {
    this._currentState = newState;
  }
  get currentState() {
    return this._currentState;
  }
}
export { RoomStateType };
