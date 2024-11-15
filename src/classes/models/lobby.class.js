import { getUserById } from '../../session/user.session.js';
import IntervalManager from '../managers/interval.manager.js';
const LOBBY_MAX_PLAYERS = 50;

class Lobby {
  constructor(id) {
    this.id = id;
    this.rooms = [];
    this.users = [];
    this.state = 'unfilled';
    this.intervalManager = new IntervalManager();
  }

  // User가 로그인하면 Lobby로 진입
  addUser(user) {
    this.users.push(user);
  }

  // 로비에서 방이 생성되면 Lobby의 rooms 안에 추가
  addRoom(room) {
    this.rooms.push(room);
  }

  stateCheck() {
    if (this.users.length >= LOBBY_MAX_PLAYERS) {
      this.state = 'filled';
    } else {
      this.state = 'unfilled';
    }
  }

  // 로비에 있는 User 조회
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  // User가 방에 입장하거나 접속을 종료하면 Lobby에서 제거
  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
  }
}

export default Lobby;
