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
    this.nextPhaseAt = Date.now() + 180000;
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
    const currentPhase = this.phaseType.getCurrentPhase();
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
      // users로 플레이어 class객체의 함수를 쓸 수 있는지 판단
      for (i = 0; i < playerList.length; i++) {
        let position = { id: playerList[i].id, x: playerList[i].getX(), y: playerList[i].getY() };
        changedPositions.push(position);
      }
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
            // console.log('id', playerList[i].id, '버려진 카드', DestroyCards);
          }
        }
      }

      // 플레이어의 디버프를 체크 한 후 해당 디버프 적용
      for (i = 0; i < playerList.length; i++) {
        // 감옥
        if (playerList[i].characterData.debuffs === CARD_TYPE.CONTAINMENT_UNIT) {
          const random = Math.random() * 100;
          if (random < 75) {
            playerList[i].setCharacterStateType(CHARACTER_STATE_TYPE.CONTAINED);
          } else {
            playerList[i].setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
            playerList[i].removeDebuff(CARD_TYPE.CONTAINMENT_UNIT);
          }
          // 위성 폭탄
        } else if (playerList[i].characterData.debuffs === CARD_TYPE.SATELLITE_TARGET) {
          const random = Math.random() * 100;
          if (random < 3) {
            playerList[i].decreaseHp();
            playerList[i].decreaseHp();
            playerList[i].decreaseHp();
            playerList[i].removeDebuff(CARD_TYPE.SATELLITE_TARGET);
          } else {
            playerList[i].removeDebuff(CARD_TYPE.SATELLITE_TARGET);
            if (i !== playerList.length - 1) {
              playerList[i + 1].addDebuff(CARD_TYPE.SATELLITE_TARGET);
            } else {
              playerList[0].addDebuff(CARD_TYPE.SATELLITE_TARGET);
            }
          }
        }
      }

      // 카드를 2장씩 드로우
      for (i = 0; i < playerList.length; i++) {
        playerList[i].characterData.handCards.push(room.cardDraw(playerList[i]));
        playerList[i].characterData.handCards.push(room.cardDraw(playerList[i]));
      }

      // 빵야 횟수 초기화
      for (i = 0; i < playerList.length; i++) {
        if (
          playerList[i].characterData.characterType === CHARACTER_TYPE.RED ||
          playerList[i].characterData.weapon === CARD_TYPE.AUTO_RIFLE
        ) {
          playerList[i].setBbangCount(99);
        } else if (playerList[i].characterData.weapon === CARD_TYPE.HAND_GUN) {
          playerList[i].setBbangCount(2);
        } else {
          playerList[i].setBbangCount(1);
        }
      }

      // 캐릭터 정보 업데이트
      userUpdateNotification(playerList);
    }

    // Phase 변경 및 다음 상태 전환 시간 설정
    // 이후 notification
    if (this.phaseType.setPhase(nextPhase)) {
      this.nextPhaseAt = nextPhase === PHASE_TYPE.END ? Date.now() + 30000 : Date.now() + 180000; // END 페이즈는 30초 지속, 나머지는 3분
      phaseUpdateNotification(playerList, nextPhase, this.nextPhaseAt, changedPositions);
      return true;
    }

    return false; // Phase 변경 실패 시 false 반환
  }
}

export default Phase;
