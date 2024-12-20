import { RoomStateType } from './room.status.js';
import { ROOM_STATE } from '../../constants/room.enum.js';
import playerList from '../player/playerList.class.js';
import { ObservableObserver } from '../observer/observer.js';
import loadCardInit from '../../utils/cardDeck.js';
import random from 'lodash/random.js';
import CardData from '../../model/card/cardData.class.js';
import Phase from './phase/phase.class.js';

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
  setState(enum_nubmer) {
    this._state.currentState = enum_nubmer;
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

  startPhase() {
    this._phase.startPhase();
    setTimeout(() => this.changePhase(), this._phase.nextPhaseAt - Date.now());
  }

  changePhase() {
    this._phase.updatePhase(this._id);
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
