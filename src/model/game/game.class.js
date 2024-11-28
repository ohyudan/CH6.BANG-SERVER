import { PhaseType, PHASE } from './game.status.js';
import { RoomStateType, STATE } from '../room/room.status.js';
import phaseUpdateNotification from '../../utils/notification/phaseUpdate.notification.js';
import { getGameAssets } from '../../init/loadGameAssets.js';
import userUpdateNotification from '../../utils/notification/userDataUpdate.notification.js';
import roomList from '../room/roomList.class.js';

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
        nextPhase = PHASE.DAY; // END 이후 DAY로 재전환
        break;
      default:
        return false; // 유효하지 않은 Phase
    }

    const room = roomList.getRoom(roomId);
    const playerList = room.getAllPlayers();

    let changedPositions = new Map();
    if (nextPhase === PHASE.END) {
      // 현재 플레이어 캐릭터의 위치
      // users로 플레이어 class객체의 함수를 쓸 수 있는지 판단
      for (i = 0; i < playerList.length; i++) {
        let position = { id: playerList[i].id, x: playerList[i].getX(), y: playerList[i].getY() };
        changedPositions.push(position);
      }
    } else {
      // 캐릭터 위치 재조정
      const gameAssets = getGameAssets();

      const characterPositions = gameAssets.characterPositionData.position;
      // 위치 정보 셔플링 및 유저 위치 설정
      const selectedPositions = new Set();
      while (selectedPositions.size < playerList.length) {
        const randId = Math.floor(Math.random() * characterPositions.length);
        selectedPositions.add(characterPositions[randId]);
      }

      const posArr = [...selectedPositions];
      for (i = 0; i < playerList.length; i++) {
        let position = { id: playerList[i].id, x: posArr[i].x, y: posArr[y] };
        changedPositions.push(position);
      }

      // 낮 시작시 자신의 핸드가 자신의 체력 이상이면 랜덤으로 체력 수치만큼 카드를 버리도록 조정
      for (i = 0; i < playerList.length; i++) {
        if (playerList[i].handCardsCount > playerList[i].hp) {
          while (playerList[i].handCards.length < playerList[i].hp) {
            let DestroyCards = playerList[i].handCards.splice(
              Math.floor(Math.random() * playerList[i].handCards.length),
              1,
            )[0];
            console.log('id', playerList[i].id, '버려진 카드', DestroyCards);
          }
        }
      }

      // 자신의 디버프를 체크 한 후 해당 디버프 적용

      // 카드를 2장씩 드로우

      // 빵야 횟수 초기화

      // 캐릭터 정보 업데이트
      userUpdateNotification();
    }

    // Phase 변경 및 다음 상태 전환 시간 설정
    // 이후 notification
    if (this.phaseManager.setPhase(nextPhase)) {
      this.nextPhaseAt = nextPhase === PHASE.END ? Date.now() + 30000 : Date.now() + 180000; // END 페이즈는 30초 지속, 나머지는 3분
      phaseUpdateNotification(user, nextPhase, this.nextPhaseAt, changedPositions);
      return true;
    }

    return false; // Phase 변경 실패 시 false 반환
  }
}

export default Game;
