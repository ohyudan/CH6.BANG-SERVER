import Player from './player.class.js';
class PlayerList {
  constructor() {
    this._playerList = new Map();
  }

  addPlayer = (id, nickname, socket) => {
    const player = new Player(id, nickname, socket);
    this._playerList.set(id, player);
  };
  subPlayer = (id) => {
    this._playerList.delete(id);
  }; // 게임 종료 시 발생

  getPlayer = (id) => {
    return this._playerList.get(id);
  };
}
const playerList = new PlayerList();
export default playerList;
