import { PhaseType, PHASE } from './game.status.js';

class Game {
  constructor(id, roomId, users) {
    this.id = id; // 고유 게임 ID
    this.roomId = roomId; // 방 ID
    this.users = users; // 방에 있는 유저 리스트
    this.phaseManager = new PhaseType(); // Phase 관리
    this.nextPhaseAt = null; // 다음 상태 전환 시간
  }

  // 게임 시작
  startGame() {
    if (this.phaseManager.getCurrentPhase() !== PHASE.NONE_PHASE) {
      console.error('게임이 이미 실행중이거나 종료되었습니다.');
      return false;
    }

    this.phaseManager.setPhase(PHASE.DAY);
    this.nextPhaseAt = Date.now() + 180000; // 3분 후
    console.log(`Game started in room: ${this.roomId}`);
    this.notifyUsers({
      type: 'GameStart',
      phaseType: this.phaseManager.getCurrentPhase(),
      nextPhaseAt: this.nextPhaseAt,
    });
    return true;
  }

  // 페이즈 업데이트
  updatePhase() {
    const currentPhase = this.phaseManager.getCurrentPhase();
    let nextPhase;

    switch (currentPhase) {
      case PHASE.DAY:
        nextPhase = PHASE.EVENING;
        break;
      case PHASE.EVENING:
        nextPhase = PHASE.END;
        break;
      case PHASE.END:
        console.log('Game has ended. No further phases.');
        this.nextPhaseAt = null; // END 단계는 타이머 없음
        return false;
      default:
        console.error('Invalid phase state.');
        return false;
    }

    this.phaseManager.setPhase(nextPhase);
    this.nextPhaseAt = nextPhase === PHASE.END ? null : Date.now() + 180000; // 다음 상태 전환 시간
    console.log(`Phase updated to: ${Object.keys(PHASE).find((key) => PHASE[key] === nextPhase)}.`);
    this.notifyUsers({
      type: 'PhaseUpdate',
      phaseType: this.phaseManager.getCurrentPhase(),
      nextPhaseAt: this.nextPhaseAt,
    });
    return true;
  }

  // 사용자들에게 알림 전송
  notifyUsers(notification) {
    this.users.forEach((user) => {
      user.socket.write(notification); // 사용자 소켓에 알림 전송
    });
  }
}

export default Game;
