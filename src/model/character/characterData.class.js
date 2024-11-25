import { Packets } from '../../init/loadProtos.js';
import CharacterStateInfoData from './characterStateInfoData.class.js';

class CharacterData {
  constructor() {
    this.characterType = Packets.CharacterType.NONE_CHARACTER;
    this.roleType = Packets.RoleType.NONE_ROLE;
    this.hp = 0; // int32
    this.weapon = 0; // int32
    this.stateInfo = new CharacterStateInfoData(); // CharacterStateInfoData Object
    this.equips = []; // int32
    this.debuffs = []; // int32
    this.handCards = []; // CardData Object
    this.bbangCount = 0; // int32
    this.handCardsCount = 0; // int32
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