// import { getProtoMessages } from '../../init/loadProtos.js';
// import characterType from '../../../gameAsset/user/CharacterType.js';

// // message CharacterData {
// //     CharacterType characterType = 1;
// //     RoleType roleType = 2;
// //     int32 hp = 3;
// //     int32 weapon = 4;
// //     CharacterStateInfoData stateInfo = 5;
// //     repeated int32 equips = 6;
// //     repeated int32 debuffs = 7;
// //     repeated CardData handCards = 8;
// //     int32 bbangCount = 9;
// //     int32 handCardsCount = 10;
// // }

// export const userResponse = () => {
//   const protoMessages = getProtoMessages();
//   const CharacterDataProto = protoMessages.user.CharacterData;

//   const CharacterData = {
//     characterType: null,
//     RoleType: null,
//     hp: null,
//     weapon: null,
//     CharacterStateInfoData: null,
//     equips: null,
//     debuffs: null,
//     CardData: null,
//     bbangCount: null,
//     handCardsCount: null,
//   };

//   const result = CharacterDataProto.encode(CharacterData).finish();

//   return result;
// };
// export const selectCharacherType = (number) => {
//   let result = characterType[number].proto;

//   return result;
// };
