// 룸을 생성하거나 참가할 때 해당 플레이어에게 id를 적용하여 해당 룸에 늘리는 용도
// roomId 해당 룸의 id

// roomId를 통해 룸 정보를 찾아서
// 해당 룸 내부의 유저중 가장 높은 id를 가진 유저의 id보다 +1한 값을 유저에게 부여
// 해당 룸의 유저데이터에 추가
// 캐릭터 데이터는 게임 시작시 각 유저에게 부여하는 것이기 때문에 해당 함수에서는 null값 부여
export const newPlayer = (roomId, socket) => {
  const room = findRoom(roomId); // 미완성, 없는 함수

  const maxId = max(room.userData.id); // 미완성, 없는 함수, 룸 방식을 보고 확실하게 결정

  let nextId;
  if (!maxId) {
    nextId = 1;
  } else {
    nextId = maxId++;
  }

  const characterData = {
    characterType: null,
    roleType: null,
    hp: null,
    weapon: null,
    stateInfo: null,
    equips: null,
    debuffs: null,
    handCards: null,
    bbangCount: null,
    handCardsCount: null,
  };

  // socket에서 바로 nickname을 받아오지 못한다면 받는 로직 추가
  const NewUserData = { id: nextId, nickname: socket.nickname, character: characterData };

  // 해당 룸의 유저데이터에 해당 유저데이터를 추가
  room.userData.push(NewUserData);
};
