const userUpdateNotification = (room) => {
  const roomPlayList = room.getAllPlayers();

  roomPlayList.forEach((values, key) => {
    const S2CUserUpdateNotification = {
    }
  });
};

export default userUpdateNotification;

// message UserData {
//     int64 id = 1;
//     string nickname = 2;
//     CharacterData character = 3;
// }

// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }