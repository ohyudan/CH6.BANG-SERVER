class PlayerStateManager {
  constructor() {
    this.intervals = new Map();
  }

  setTimerPlayerState(callback, interval, type = 'timer') {
    if (!this.intervals.has(userId)) {
      this.intervals.set(new Map());
    }
    this.intervals.set(type, setInterval(callback, interval));
  }

  removeTimerPlayerState(type = 'timer') {
    if (this.intervals.has(type)) {
      clearInterval(this.intervals.get(type));
      this.intervals.delete(type);
    }
  }
}

export default PlayerStateManager;