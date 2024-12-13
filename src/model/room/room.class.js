import { RoomStateType } from './room.status.js';
import { ROOM_STATE } from '../../constants/room.enum.js';
import playerList from '../player/playerList.class.js';
import { ObservableObserver } from '../observer/observer.js';
import loadCardInit from '../../utils/cardDeck.js';
import random from 'lodash/random.js';
import CardData from '../../model/card/cardData.class.js';
import Phase from './phase/phase.class.js';
import positionUpdateNotification from '../../utils/notification/user/positionUpdate.notification.js';
import roomList from './roomList.class.js';
import gameEndNotification from '../../utils/notification/gameStatus/gameEnd.notification.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import userUpdateNotification from '../../utils/notification/user/userUpdate.notification.js';

class Room extends ObservableObserver {
  constructor(id, ownerId, name, maxUserNum) {
    super();
    this._id = id; // 방 아이디
    this._ownerId = ownerId;
    this._name = name;
    this._maxUserNum = maxUserNum;
    this._state = new RoomStateType();
    this._playerList = new Map();
    this._deck = loadCardInit();
    this._phase = new Phase();
    this._cardPlayList = new Array();

    let ownerPlayer = playerList.getPlayer(ownerId);
    this.addPlayer(ownerPlayer);

    //this.notifyObservers('roomCreate', this);
  }
  get id() {
    return this._id;
  }
  get ownerId() {
    return this._ownerId;
  }

  getRoomData() {
    //const test = getProtoMessages();
    //let roomMessage = test.room.RoomStateType.values.WAIT;

    const users = [];
    this._playerList.forEach((values) => {
      users.push(values.makeRawObject());
    });
    const RoomData = {
      id: this._id,
      ownerId: this._ownerId,
      name: this._name,
      maxUserNum: this._maxUserNum,
      state: this._state.currentState,
      users: users,
    };

    return RoomData;
  }
  /**
   *
   * @param {number} enum_nubmer
   * @returns 결과
   */
  setState(enum_number) {
    this._state.currentState = enum_number;

    // 게임이 시작되는 시점(INGAME)에 게임 종료 체크 시작
    if (enum_number === ROOM_STATE.INGAME) {
      this.startGameEndCheck();
    }
  }
  /**
   *
   * @returns {number}
   */
  getState() {
    return this._state.currentState;
  }

  /**
   *
   * @param {Player}
   * @returns {bool} 성공 시 true  실패 시 false
   */
  addPlayer(player) {
    const currentUserNumber = this._playerList.size;
    if (this._maxUserNum <= currentUserNumber) {
      return false;
    }
    this._playerList.set(player.id, player);
    player.addObserver(this);
    return true;
  }

  addCardPlayList(playerId, cardType) {
    this._cardPlayList.push({ playerId: playerId, cardType: cardType });
    return true;
  }

  useCardPlayList() {
    const data = this._cardPlayList[0];
    if (data === undefined) {
      return false;
    }
    const player = this.getPlayer(data.playerId);
    const playerId = data.playerId;
    const cardType = data.cardType;

    let cannotUse = false;

    this._playerList.forEach((player) => {
      // NONE 또는 CONTAINED가 아닌 상태가 있는 경우 cannotUse = true
      if (
        player.characterData.stateInfo.state !== CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE &&
        player.characterData.stateInfo.state !== CHARACTER_STATE_TYPE.CONTAINED
      ) {
        cannotUse = true;
      }
    });

    if (cannotUse) {
      console.log('게릴라 무차별이 사용 불가능한 상태');
      return false;
    } else {
      this._cardPlayList.splice(0, 1);
      // 사용자를 제외한 나머지에게 카드타입에 해당하는 스테이트를 부여
      let targetStateType = null;
      switch (cardType) {
        case CARD_TYPE.BIG_BBANG: {
          targetStateType = CHARACTER_STATE_TYPE.BIG_BBANG_TARGET;
          break;
        }
        case CARD_TYPE.GUERRILLA: {
          targetStateType = CHARACTER_STATE_TYPE.GUERRILLA_TARGET;
          break;
        }
      }

      this._playerList.forEach((player) => {
        if (player.id !== playerId) {
          player.setNextCharacterStateType(player.characterData.stateInfo.state);
          player.setCharacterStateType(targetStateType);
          player.setStateTargetUserId(playerId);
        }
      });

      userUpdateNotification(this);
    }

    // 게릴라, 무차별 난사만 처리하는 용도로 사용할 생각
    // 플레이어들의 스테이트 타입이 다 NONE또는 감금인 상태일 때 작동
    // 카드 사용자는 shooter로 나머지 중에서 체력이 1 이상인 사람들은 target으로
    // 변경된 상태를 알려줌
  }

  subCardPlayList() {
    const firstDataKey = this._cardPlayList.keys().next().value;
    if (firstDataKey !== undefined) {
      this._cardPlayList.delete(firstDataKey);
    }
  }
  /**
   *
   * @param {Player}
   * @returns {bool} 성공 시 true  실패 시 false
   */
  subPlayer(player) {
    if (!this._playerList.has(player.id)) {
      return false;
    }
    this._playerList.delete(player.id);
    player.removeObserver(this);
    player.currentRoomId = null;
    if (this._playerList.size === 0) {
      this.notifyObservers('roomEmpty', this);
    }
    return true;
  }
  getAllPlayers() {
    return this._playerList;
  }

  getPlayer(playerId) {
    return this._playerList.get(playerId);
  }

  /**
   *  게임 시작 가능 여부 확인 함수.
   * @param {number} number
   * @returns {bool}
   */
  startGame(number) {
    if (ROOM_STATE.WAIT === this._state.currentState) {
      return true;
    }
    return false;
  }
  /**
   * 방의 카드 덱 설정
   * @param {DoubleLinkedList} deck - 카드 덱
   */
  setDeck(deck) {
    this._deck = deck;
  }

  /**
   * 방의 카드 덱 가져오기
   * @returns {DoubleLinkedList} - 저장된 카드 덱
   */
  getDeck() {
    return this._deck;
  }
  //카드를 뽑는 함수 앞에서 제거한만큼 뒤에 다시 append해준다.
  cardDraw(player) {
    const drawCard = this._deck.removeFront();
    return drawCard;
  }

  deckUseCardAdd(card) {
    const size = this._deck.getSize();
    const randomNumber = random(0, size);
    this._deck.insert(card, randomNumber);
    return null;
  }

  startGameEndCheck() {
    setTimeout(() => this.checkGameEnd(), 1000); // 1초마다 체크
  }

  checkGameEnd() {
    // 방이 존재하는지 확인
    const room = roomList.getRoom(this.id);
    if (!room || this._state.currentState !== ROOM_STATE.INGAME) {
      return;
    }

    // gameEndNotification을 호출하여 게임 종료 여부 확인
    gameEndNotification(this.id);

    // 게임이 끝나지 않았다면 계속 체크
    setTimeout(() => this.checkGameEnd(), 1000);
  }

  startPhase() {
    this._phase.startPhase();
    setTimeout(() => this.changePhase(), this._phase.nextPhaseAt - Date.now());
  }

  changePhase() {
    this._phase.updatePhase(this._id);
  }

  startPositionUpdate() {
    setTimeout(() => this.userPositionUpdate(), 200);
  }

  userPositionUpdate() {
    // console.log('포지션업데이트 반복');
    let positionChange = false;

    const room = roomList.getRoom(this.id);
    if (!room) {
      return;
    }
    // console.log('포지션 변경 검증');
    const inGameUsers = Array.from(this.getAllPlayers().values());

    inGameUsers.forEach((user) => {
      if (user.hasPositionChanged()) {
        user.previousPosition = { ...user.position };
        positionChange = true;
      }
    });

    if (positionChange === true) {
      positionUpdateNotification(this);
      // console.log('포지션 변경 확인으로 패킷 발송');
    } else {
      // console.log('포지션 변경 없음');
    }

    setTimeout(() => this.userPositionUpdate(), 200);
    return;
  }

  update(event, data) {
    let result;
    switch (event) {
      case 'addHandCard':
        result = this.cardDraw(data);
        return result;
        break;
      case 'removeHandCard':
        result = this.deckUseCardAdd(data);
        return result;
      default:
        break;
    }
  }
}

export default Room;
// message RoomData {
//   int32 id = 1;
//   int64 ownerId = 2;
//   string name = 3;
//   int32 maxUserNum = 4;
//   RoomStateType state = 5; // WAIT 0, PREPARE 1, INAGAME 2
//   repeated UserData users = 6; // 인덱스 기반으로 턴 진행
// }
