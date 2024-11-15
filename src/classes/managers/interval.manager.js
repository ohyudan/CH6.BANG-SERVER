import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map()); // Intervals 객체에 유저와 새로운 Map 객체를 추가
    }
    this.intervals.get(playerId).set(type, setInterval(callback, interval)); // 해당하는 유저
  }

  addLobby(lobbyId, callback, interval) {
    this.addPlayer(lobbyId, callback, interval, 'lobby');
  }

  removeLobby(lobbyId) {
    if (this.intervals.has(lobbyId)) {
      const lobbyInterval = this.intervals.get(lobbyId);
      clearInterval(lobbyInterval.get('lobby'));
      this.intervals.delete(lobbyId);
    }
  }

  removePlayer(playerId) {
    if (this.Intervals.has(playerId)) {
      const userIntervals = this.Intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId)); // 유저Id로 조회된 모든 interval들을 제거
      this.intervals.delete(playerId); // intervals 객체에서 해당 유저를 제거
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => {
        clearInterval(intervalId); // 모든 interval을 중지
      });
    });
    this.intervals.clear(); // interval 비우기
  }

  get;
}

export default IntervalManager;
