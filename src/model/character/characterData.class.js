import CharacterStateInfoData from './characterStateInfoData.class.js';
import { CHARACTER_TYPE, ROLE_TYPE } from '../../constants/user.enum.js';

class CharacterData {
  constructor() {
    this.characterType = CHARACTER_TYPE.NONE_CHARACTER;
    this.roleType = ROLE_TYPE.NONE_ROLE;
    this.hp = 0; // int32
    this.weapon = 0; // int32
    this.stateInfo = new CharacterStateInfoData(); // CharacterStateInfoData Object
    this.equips = []; // int32
    this.debuffs = []; // int32
    this.handCards = []; // CardData class
    this.bbangCount = 0; // int32
    this.handCardsCount = 0; // int32
  }

  getAllhandCard() {
    const result = [];
    this.handCards.forEach((value) => {
      const cardData = value.getCardData();
      result.push(cardData);
    });
    return result;
  }
  /**
   *
   * @param {cardType} cardType 카드 타입
   * @returns card,index
   */
  getCardsearch(cardType) {
    const index = this.handCards.findIndex((card) => card.type == cardType);

    if (index !== -1) {
      const card = this.handCards[index];
      return { card, index };
    } else {
      // 조건에 맞는 카드가 없으면
      return null;
    }
  }
}

export default CharacterData;
// message CharacterData {
//     CharacterType characterType = 1;
//     RoleType roleType = 2;
//     int32 hp = 3;
//     int32 weapon = 4;
//     CharacterStateInfoData stateInfo = 5;
//     repeated int32 equips = 6;
//     repeated int32 debuffs = 7;
//     repeated CardData handCards = 8;
//     int32 bbangCount = 9;
//     int32 handCardsCount = 10;
// }
