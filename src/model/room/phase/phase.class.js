import { PhaseType } from './phase.status.js';
import phaseUpdateNotification from '../../../utils/notification/phaseUpdate.notification.js';
import { getGameAssets } from '../../../init/loadGameAssets.js';
import userUpdateNotification from '../../../utils/notification/userDataUpdate.notification.js';
import roomList from '../roomList.class.js';
import { CHARACTER_STATE_TYPE, CHARACTER_TYPE } from '../../../constants/user.enum.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import playerList from '../../player/playerList.class.js';
import { PHASE_TYPE } from '../../../constants/room.enum.js';

class Phase {
  constructor() {
    this.phaseType = new PhaseType(); // Phase 관리
    this.nextPhaseAt = null; // 다음 상태 전환 시간
  }

  startPhase() {
    this.phaseType.setPhase(PHASE_TYPE.DAY);
    this.nextPhaseAt = Date.now() + 30000;
  }

  /**
   * 페이즈 업데이트 메서드
   * Room 상태가 INGAME일 때만 작동
   * @returns {boolean} 성공 여부
   */
  updatePhase(playerList) {
    // // Room 상태가 INGAME인지 확인
    // if (this.roomState.getCurrentStateData() !== STATE.INGAME) {
    //   return false; // INGAME 상태가 아니면 업데이트 불가
    // }
    const currentPhase = this.phaseType.phase;
    let nextPhase;

    // 현재 Phase에 따라 다음 Phase 결정
    switch (currentPhase) {
      case PHASE_TYPE.DAY:
        nextPhase = PHASE_TYPE.END; // DAY 이후 바로 END로 전환
        break;
      case PHASE_TYPE.END:
        nextPhase = PHASE_TYPE.DAY; // END 이후 DAY로 재전환
        break;
      default:
        return false; // 유효하지 않은 Phase
    }

    let changedPositions = new Map();
    if (nextPhase === PHASE_TYPE.END) {
      // 현재 플레이어 캐릭터의 위치
      playerList.forEach((value, key) => {
        let position = { id: value.id, x: value.getX(), y: value.getY() };
        changedPositions.push(position);
      });
    } else {
      // 1. 위치 재조정
      // 2. 자신의 hp이하의 카드 버리기 >> 밤이 끝날때
      // 3. 자신의 디버프 적용
      // 4. 덱에서 2장씩 드로우
      // 5. 빵야 횟수 초기화

      // 캐릭터 위치 재조정
      const gameAssets = getGameAssets();

      const characterPositions = gameAssets.characterPositionData.position;
      // 위치 정보 셔플링 및 유저 위치 설정
      const selectedPositions = new Set();
      while (selectedPositions.size < ArrayPlayerList.length) {
        const randId = Math.floor(Math.random() * characterPositions.length);
        selectedPositions.add(characterPositions[randId]);
      }

      const posArr = [...selectedPositions];
      for (let i = 0; i < ArrayPlayerList.length; i++) {
        let position = { id: ArrayPlayerList[i].id, x: posArr[i].x, y: posArr[y] };
        changedPositions.push(position);
      }

      // 낮 시작시 자신의 핸드가 자신의 체력 이상이면 랜덤으로 체력 수치만큼 카드를 버리도록 조정
      for (let i = 0; i < ArrayPlayerList.length; i++) {
        if (ArrayPlayerList[i].handCardsCount > ArrayPlayerList[i].hp) {
          while (ArrayPlayerList[i].handCards.length < ArrayPlayerList[i].hp) {
            let DestroyCards = ArrayPlayerList[i].handCards.splice(
              Math.floor(Math.random() * ArrayPlayerList[i].handCards.length),
              1,
            )[0];
            // console.log('id', ArrayPlayerList[i].id, '버려진 카드', DestroyCards);
          }
        }
      }

      // 플레이어의 디버프를 체크 한 후 해당 디버프 적용
      for (let i = 0; i < ArrayPlayerList.length; i++) {
        // 감옥
        if (ArrayPlayerList[i].characterData.debuffs === CARD_TYPE.CONTAINMENT_UNIT) {
          const random = Math.random() * 100;
          if (random < 75) {
            ArrayPlayerList[i].setCharacterStateType(CHARACTER_STATE_TYPE.CONTAINED);
          } else {
            ArrayPlayerList[i].setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
            ArrayPlayerList[i].removeDebuff(CARD_TYPE.CONTAINMENT_UNIT);
          }
          // 위성 폭탄
        } else if (ArrayPlayerList[i].characterData.debuffs === CARD_TYPE.SATELLITE_TARGET) {
          const random = Math.random() * 100;
          if (random < 3) {
            ArrayPlayerList[i].decreaseHp();
            ArrayPlayerList[i].decreaseHp();
            ArrayPlayerList[i].decreaseHp();
            ArrayPlayerList[i].removeDebuff(CARD_TYPE.SATELLITE_TARGET);
          } else {
            ArrayPlayerList[i].removeDebuff(CARD_TYPE.SATELLITE_TARGET);
            if (i !== ArrayPlayerList.length - 1) {
              ArrayPlayerList[i + 1].addDebuff(CARD_TYPE.SATELLITE_TARGET);
            } else {
              ArrayPlayerList[0].addDebuff(CARD_TYPE.SATELLITE_TARGET);
            }
          }
        }
      }

      // 카드를 2장씩 드로우
      for (let i = 0; i < ArrayPlayerList.length; i++) {
        ArrayPlayerList[i].characterData.handCards.push(room.cardDraw(ArrayPlayerList[i]));
        ArrayPlayerList[i].characterData.handCards.push(room.cardDraw(ArrayPlayerList[i]));
      }

      // 빵야 횟수 초기화
      for (let i = 0; i < ArrayPlayerList.length; i++) {
        if (
          ArrayPlayerList[i].characterData.characterType === CHARACTER_TYPE.RED ||
          ArrayPlayerList[i].characterData.weapon === CARD_TYPE.AUTO_RIFLE
        ) {
          ArrayPlayerList[i].setBbangCount(99);
        } else if (ArrayPlayerList[i].characterData.weapon === CARD_TYPE.HAND_GUN) {
          ArrayPlayerList[i].setBbangCount(2);
        } else {
          ArrayPlayerList[i].setBbangCount(1);
        }
      }

      // 캐릭터 정보 업데이트
      userUpdateNotification(ArrayPlayerList);
    }

    // Phase 변경 및 다음 상태 전환 시간 설정
    // 이후 notification
    if (this.phaseType.setPhase(nextPhase)) {
      this.nextPhaseAt = nextPhase === PHASE_TYPE.END ? Date.now() + 10000 : Date.now() + 30000; // END 페이즈는 30초 지속, 나머지는 3분
      phaseUpdateNotification(ArrayPlayerList, nextPhase, this.nextPhaseAt, changedPositions);
      return true;
    }

    return false; // Phase 변경 실패 시 false 반환
  }
}

export default Phase;
