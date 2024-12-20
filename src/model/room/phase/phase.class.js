import { PhaseType } from './phase.status.js';
import phaseUpdateNotification from '../../../utils/notification/phaseUpdate.notification.js';
import { getGameAssets } from '../../../init/loadGameAssets.js';
import { CHARACTER_STATE_TYPE, CHARACTER_TYPE } from '../../../constants/user.enum.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import { PHASE_TYPE } from '../../../constants/room.enum.js';
import roomList from '../roomList.class.js';
import Config from '../../../config/config.js';
import random from 'lodash/random.js';
import userUpdateNotification from '../../../utils/notification/user/userUpdate.notification.js';
import playerList from '../../player/playerList.class.js';

class Phase {
  constructor() {
    this.phaseType = new PhaseType(); // Phase 관리
    this.nextPhaseAt = null; // 다음 상태 전환 시간
  }

  startPhase() {
    this.phaseType.setPhase(PHASE_TYPE.DAY);
    this.nextPhaseAt = Date.now() + Config.PHASE.AFTER;
  }

  /**
   * 페이즈 업데이트 메서드
   * @param {Number} roomId 룸 아이디
   * @returns {boolean} 성공 여부
   */
  updatePhase(roomId) {
    const currentPhase = this.phaseType.phase;
    let nextPhase;
    const room = roomList.getRoom(roomId);
    if (!room) {
      return false;
    }
    const roomPlayList = room.getAllPlayers();
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

    let changedPositions = new Array();
    if (nextPhase === PHASE_TYPE.END) {
      // 현재 플레이어 캐릭터의 위치
      roomPlayList.forEach((value, key) => {
        let position = { id: value.id, x: value.getX(), y: value.getY() };
        changedPositions.push(position);
      });
    } else {
      // 1. 위치 재조정 , 체크 완료
      // 2. 자신의 hp이하의 카드 버리기 , 체크 완료
      // 3. 자신의 디버프 적용 , 체크 안됨
      // 4. 덱에서 2장씩 드로우 , 체크 완료
      // 5. 빵야 횟수 초기화 , 체크 완료

      // 캐릭터 위치 재조정
      const gameAssets = getGameAssets();

      const characterPositions = gameAssets.characterPositionData.position;
      // 위치 정보 셔플링 및 유저 위치 설정
      const selectedPositions = new Set();
      const ArrayPlayerList = [...roomPlayList];
      while (selectedPositions.size < ArrayPlayerList.length) {
        //const randId = Math.floor(Math.random() * characterPositions.length);
        const randId = random(0, characterPositions.length - 1);
        selectedPositions.add(characterPositions[randId]);
      }

      let i = 0;
      const posArr = [...selectedPositions];
      roomPlayList.forEach((value) => {
        let position = { id: value.id, x: posArr[i].x, y: posArr[i].y };
        value.position.x = posArr[i].x;
        value.position.y = posArr[i].y;
        changedPositions.push(position);
        i++;
      });

      // 낮 시작시 자신의 핸드가 자신의 체력 이상이면 랜덤으로 체력 수치만큼 카드를 버리도록 조정
      roomPlayList.forEach((value, key) => {
        if (value.characterData.handCardsCount > value.characterData.hp) {
          const needDestroyCardsCount = value.characterData.handCardsCount - value.characterData.hp;
          for (let i = 0; i < needDestroyCardsCount; i++) {
            // const randId = Math.floor(Math.random() * value.characterData.handCards.length);
            const randId = random(0, value.characterData.handCards.length - 1);
            const randCard = value.characterData.handCards[randId];
            value.removeHandCard(randCard._type);
          }
          value.decreaseHandCardsCountParam(needDestroyCardsCount);
        }
      });

      // 플레이어의 디버프를 체크 한 후 해당 디버프 적용
      roomPlayList.forEach((value, key) => {
        //const randomId = Math.random() * 100;
        if (value.characterData.debuffs.includes(CARD_TYPE.CONTAINMENT_UNIT)) {
          const randomId = random(0, 100);
          // 감옥
          if (randomId < 75) {
            value.setCharacterStateType(CHARACTER_STATE_TYPE.CONTAINED);
          } else {
            value.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
            value.removeDebuff(CARD_TYPE.CONTAINMENT_UNIT);
          }
        }
      });

      // 플레이어 id의 순서를 만들어 내기 위한 작성
      let idArray = [];
      roomPlayList.forEach((value) => {
        idArray.push(value.id);
      });

      let playerIdNumber;
      let moveSattlelite = false;
      roomPlayList.forEach((value, key) => {
        if (value.characterData.debuffs.includes(CARD_TYPE.SATELLITE_TARGET)) {
          const randomId = random(0, 100);
          // 위성 폭탄
          if (randomId < 3) {
            value.decreaseHp();
            value.decreaseHp();
            value.decreaseHp();
            value.removeDebuff(CARD_TYPE.SATELLITE_TARGET);
          } else {
            value.removeDebuff(CARD_TYPE.SATELLITE_TARGET);
            playerIdNumber = idArray.indexOf(value.id);
            moveSattlelite = true;
          }
        }
      });

      if (moveSattlelite) {
        if (playerIdNumber < idArray.length - 1) {
          const nextPlayerIdNumber = idArray[playerIdNumber + 1];
          const nextPlayer = playerList.getPlayer(nextPlayerIdNumber);
          nextPlayer.addDebuff(CARD_TYPE.SATELLITE_TARGET);
        } else {
          // id 순서가 제일 끝자리일 때
          const firstPlayerIdNumber = idArray[0];
          const firstPlayer = playerList.getPlayer(firstPlayerIdNumber);
          firstPlayer.addDebuff(CARD_TYPE.SATELLITE_TARGET);
        }
      }

      // 카드를 2장씩 드로우
      roomPlayList.forEach((value, key) => {
        value.characterData.handCards.push(room.cardDraw(value));
        value.characterData.handCards.push(room.cardDraw(value));
        value.increaseHandCardsCountParam(2);
      });

      // 빵야 횟수 초기화
      roomPlayList.forEach((value, key) => {
        value.setBbangCount(0);
      });
    }

    // Phase 변경 및 다음 상태 전환 시간 설정
    // 이후 notification
    this.phaseType.setPhase(nextPhase);
    this.nextPhaseAt =
      nextPhase === PHASE_TYPE.END
        ? Date.now() + Config.PHASE.END
        : Date.now() + Config.PHASE.AFTER;

    phaseUpdateNotification(roomPlayList, nextPhase, this.nextPhaseAt, changedPositions);
    userUpdateNotification(room);

    setTimeout(() => room.changePhase(), this.nextPhaseAt - Date.now());

    return true;
  }
}

export default Phase;
