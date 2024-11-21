export const useVaccine = (socket) => {
  const userData = socket.userData
  const charaterData = userData.charater
//   message CharacterData {
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
//   message CardData {
//     CardType type = 1;
//     int32 count = 2;
// }

  charaterData.hp++
};
