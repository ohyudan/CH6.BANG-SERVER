import { PhaseType, PHASE } from './game.status.js';
import { RoomStateType, STATE } from '../room/room.status.js';

class Game {
  constructor(id, roomId, users) {
    this.id = id; // 고유 게임 ID
    this.roomId = roomId; // 방 ID
    this.users = users; // 방에 있는 유저 리스트
    this.phaseManager = new PhaseType(); // Phase 관리
    this.roomState = new RoomStateType(); // Room 상태 관리
    this.nextPhaseAt = null; // 다음 상태 전환 시간
  }

  /**
   * 게임 시작 메서드
   * 방 상태를 PREPARE로 변경
   * @returns {boolean} 성공 여부
   */
  startGame() {
    if (!this.roomState.setState(STATE.PREPARE)) {
      // Room 상태를 PREPARE로 설정
      return false; // 실패 시 false 반환
    }

    return true; // 성공 시 true 반환
  }

  /**
   * 페이즈 업데이트 메서드
   * Room 상태가 INGAME일 때만 작동
   * @returns {boolean} 성공 여부
   */
  updatePhase() {
    // Room 상태가 INGAME인지 확인
    if (this.roomState.getCurrentStateData() !== STATE.INGAME) {
      return false; // INGAME 상태가 아니면 업데이트 불가
    }

    const currentPhase = this.phaseManager.getCurrentPhase();
    let nextPhase;

    // 현재 Phase에 따라 다음 Phase 결정
    switch (currentPhase) {
      case PHASE.DAY:
        nextPhase = PHASE.END; // DAY 이후 바로 END로 전환
        break;
      case PHASE.END:
        this.nextPhaseAt = null; // 게임 종료 시 타이머 제거
        return false; // 더 이상 업데이트할 페이즈 없음
      default:
        return false; // 유효하지 않은 Phase
    }

    // Phase 변경 및 다음 상태 전환 시간 설정
    if (this.phaseManager.setPhase(nextPhase)) {
      this.nextPhaseAt = nextPhase === PHASE.END ? Date.now() + 30000 : Date.now() + 180000; // END 페이즈는 30초 지속, 나머지는 3분
      return true;
    }

    return false; // Phase 변경 실패 시 false 반환
  }
}

export default Game;
