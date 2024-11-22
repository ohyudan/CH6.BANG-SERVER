const STATE = {
  WAIT: 0,
  PREPARE: 1,
  INGAME: 2,
};

class RoomStateType {
  constructor() {
    this._currentState = STATE.WAIT;
  }

  set currentState(newState) {
    this._currentState = newState;
  }
  get currentState() {
    return this._currentState;
  }
}
export { RoomStateType, STATE };
