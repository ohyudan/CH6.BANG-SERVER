import CharacterData from '../character/characterData.class.js';
import roomList from '../room/roomList.class.js';
import Position from './position.class.js';
import { Observable } from '../observer/observer.js';
import CardData from '../card/cardData.class.js';

class Player extends Observable {
  constructor(id, nickname, socket) {
    super();
    this._id = id;
    this._nickname = nickname;
    this.socket = socket;
    this._currentRoomId = null;

    this.characterData = new CharacterData(); // CharacterData 객체 생성

    this.position = new Position(); // Position 객체 생성
  }
  get id() {
    return this._id;
  }
  set currentRoomId(roomId) {
    this._currentRoomId = roomId;
  }
  get currentRoomId() {
    return this._currentRoomId;
  }
  get nickname() {
    return this._nickname;
  }
  // 위치 업데이트
  updatePosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  // 플레이어의 x 좌표 반환
  getX() {
    return this.position.x;
  }

  // 플레이어의 y 좌표 반환
  getY() {
    return this.position.y;
  }

  // 캐릭터 타입 설정
  setCharacterType(characterType) {
    this.characterData.characterType = characterType;
  }

  // 캐릭터 역할 설정
  setCharacterRoleType(roleType) {
    this.characterData.roleType = roleType;
  }

  // 캐릭터의 체력(HP) 설정
  setHp(hp) {
    this.characterData.hp = hp;
  }

  // 캐릭터의 체력 증가
  increaseHp() {
    this.characterData.hp += 1;
  }

  // 캐릭터의 체력 감소
  decreaseHp() {
    this.characterData.hp -= 1;
  }

  // 캐릭터가 사용하는 무기 설정
  setWeapon(weapon) {
    this.characterData.weapon = weapon;
  }

  // 현재 캐릭터 상태 설정
  setCharacterStateType(characterStateType) {
    this.characterData.stateInfo.state = characterStateType;
  }

  // 캐릭터의 다음 상태 설정
  setNextCharacterStateType(nextStateType) {
    this.characterData.stateInfo.nextState = nextStateType;
  }

  // 다음 상태로 변경될 시각 설정 (타임스탬프)
  setNextStateAt(nextStateAt) {
    this.characterData.stateInfo.nextStateAt = nextStateAt;
  }

  // 상태 변경의 대상 사용자 ID 설정
  setStateTargetUserId(targetUserId) {
    this.characterData.stateInfo.stateTargetUserId = targetUserId;
  }

  // 캐릭터의 장비 추가
  addEquip(equip) {
    this.characterData.equips.push(equip);
  }

  // 캐릭터의 디버프 추가
  addDebuff(debuff) {
    this.characterData.debuffs.push(debuff);
  }

  // 캐릭터의 디버프 제거 (phaseBranch에서 추가함)
  removeDebuff(debuff) {
    this.characterData.debuffs = this.characterData.debuffs.filter((buff) => buff !== debuff);
  }

  // 캐릭터의 손패(카드) 추가
  /**
   *
   * @param {Card} card
   *
   */
  addHandCard() {
    const card = this.notifyObservers('addHandCard', this);
    if (!(card == null)) {
      this.characterData.handCards.push(card);
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * @param {CardType} CardType CardType
   *
   * 덱으로 반환 필요
   */
  // 캐릭터의 손패(카드) 제거
  removeHandCard(cardType) {
    const { result, index } = this.characterData.getCardsearch(cardType);
    if (!(result == null)) {
      this.notifyObservers('removeHandCard', result);

      this.characterData.handCards.splice(index, 1);
      return true;
    }
    return false;
  }

  // 빵야 사용 횟수 증가
  increaseBbangCount() {
    this.characterData.bbangCount += 1;
  }

  // 빵야 사용 횟수 지정 (phaseBranch에서 추가함)
  setBbangCount(count) {
    this.characterData.bbangCount = count;
  }

  // 빵야 사용 횟수 감소
  decreaseBbangCount() {
    this.characterData.bbangCount -= 1;
  }

  // 손패 카드 수 증가
  increaseHandCardsCount() {
    this.characterData.handCardsCount += 1;
  }
  // 손패 매개변수 만큼 카드 수 증가
  increaseHandCardsCountParam(count) {
    this.characterData.handCardsCount += count;
  }
  // 손패 카드 수 감소
  decreaseHandCardsCount() {
    this.characterData.handCardsCount -= 1;
  }

  // Player 데이터 직렬화
  makeRawObject() {
    return {
      id: this._id,
      nickname: this._nickname,
      character: {
        characterType: this.characterData.characterType,
        roleType: this.characterData.roleType,
        hp: this.characterData.hp,
        weapon: this.characterData.weapon,
        stateInfo: {
          state: this.characterData.stateInfo.state,
          nextState: this.characterData.stateInfo.nextState,
          nextStateAt: this.characterData.stateInfo.nextStateAt,
          stateTargetUserId: this.characterData.stateInfo.stateTargetUserId,
        },
        equips: this.characterData.equips,
        debuffs: this.characterData.debuffs,
        handCards: this.characterData.getAllhandCard(),
        bbangCount: this.characterData.bbangCount,
        handCardsCount: this.characterData.handCardsCount,
      },
    };
  }
  getAllUsersData() {
    const room = roomList.getRoom(this._currentRoomId);
    const inGameUsers = Array.from(room.getAllPlayers().values());

    return inGameUsers.map((user) => {
      if (user.id === this._id) {
        return {
          id: user.id,
          nickname: user.nickname,
          character: {
            characterType: user.characterData.characterType,
            roleType: user.characterData.roleType,
            hp: user.characterData.hp,
            weapon: user.characterData.weapon,
            stateInfo: user.characterData.stateInfo,
            equips: user.characterData.equips,
            debuffs: user.characterData.debuffs,
            handCards: user.characterData.handCards,
            bbangCount: user.characterData.bbangCount,
            handCardsCount: user.characterData.handCardsCount,
          },
        };
      } else {
        return {
          id: user.id,
          nickname: user.nickname,
          character: {
            characterType: user.characterData.characterType,
            hp: user.characterData.hp,
            weapon: user.characterData.weapon,
            stateInfo: user.characterData.stateInfo,
            equips: user.characterData.equips,
            debuffs: user.characterData.debuffs,
            bbangCount: user.characterData.bbangCount,
            handCardsCount: user.characterData.handCardsCount,
          },
        };
      }
    });
  }

  notifyObservers(event, data) {
    return this.observers.map((observer) => observer.update(event, data))[0];
  }
}
export default Player;

// message UserData {
//   int64 id = 1;
//   string nickname = 2;
//   CharacterData character = 3;
// }
// enum CharacterType {
//     NONE_CHARACTER = 0;
//     RED = 1; // 빨강이
//     SHARK = 3; // 상어군
//     MALANG = 5; // 말랑이
//     FROGGY = 7; // 개굴군
//     PINK = 8; // 핑크군
//     SWIM_GLASSES = 9; // 물안경군
//     MASK = 10; // 가면군
//     DINOSAUR = 12; // 공룡이
//     PINK_SLIME = 13; // 핑크슬라임
// }

// message CharacterPositionData {
//     int64 id = 1;
//     double x = 2;
//     double y = 3;
// }enum CharacterStateType {
//     NONE_CHARACTER_STATE = 0;
//     BBANG_SHOOTER = 1; // 빵야 시전자
//     BBANG_TARGET = 2; // 빵야 대상 (쉴드 사용가능 상태)
//     DEATH_MATCH_STATE = 3; // 현피 중 자신의 턴이 아닐 때
//     DEATH_MATCH_TURN_STATE = 4; // 현피 중 자신의 턴
//     FLEA_MARKET_TURN = 5; // 플리마켓 자신의 턴
//     FLEA_MARKET_WAIT = 6; // 플리마켓 턴 대기 상태
//     GUERRILLA_SHOOTER = 7; // 게릴라 시전자
//     GUERRILLA_TARGET = 8; // 게릴라 대상
//     BIG_BBANG_SHOOTER = 9; // 난사 시전자
//     BIG_BBANG_TARGET = 10; // 난사 대상
//     ABSORBING = 11; // 흡수 중
//     ABSORB_TARGET = 12; // 흡수 대상
//     HALLUCINATING = 13; // 신기루 중
//     HALLUCINATION_TARGET = 14; // 신기루 대상
//     CONTAINED = 15; // 감금 중
// }

// enum RoleType {
//     NONE_ROLE = 0;
//     TARGET = 1;
//     BODYGUARD = 2;
//     HITMAN = 3;
//     PSYCHOPATH = 4;
// }

// message CharacterStateInfoData {
//     CharacterStateType state = 1;
//     CharacterStateType nextState = 2;
//     int64 nextStateAt = 3; // state가 nextState로 풀리는 밀리초 타임스탬프. state가 NONE이면 0
//     int64 stateTargetUserId = 4; // state에 target이 있을 경우
// }
