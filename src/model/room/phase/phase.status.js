import { PHASE_TYPE } from '../../../constants/room.enum.js';

class PhaseType {
  constructor() {
    this._phase = PHASE_TYPE.NONE_PHASE; // 초기 상태 : NONE_PHASE
  }

  /**
   * 상태 변경 메서드
   * @param {number} newPhase - 변경할 Phase
   * @returns {boolean} 성공 시 true, 실패 시 false
   */
  setPhase(newPhase) {
    if (Object.values(PHASE_TYPE).includes(newPhase)) {
      // 객체 값 포함 여부를 확인
      this._phase = newPhase;
      console.log(`Phase changed to: ${newPhase}`);
      return true;
    }
    console.error('Invalid phase change attempt.');
    return false;
  }

  /**
   * 현재 상태 반환 메서드
   * @returns {number} 현재 Phase
   */
  get phase() {
    return this._phase;
  }
}

export { PhaseType };
