import { Packets } from '../../init/loadProtos.js';

/**
 * 게임 준비 알림 데이터를 생성
 * @param {Room} room - 방 객체
 * @param {User} me - 알림을 받는 유저
 * @returns {object} - 알림 데이터
 */
const gamePrepareNotification = (room, me) => {
  return {
    gamePrepareNotification: {
      room: {
        id: room.id,
        ownerId: room.ownerId,
        name: room.name,
        maxUserNum: room.maxUserNum,
        state: room.getState(), // 방 상태
        users: room.getAllPlayers().map((user) => {
          // 본인이 아닌 경우 or target이 아닌 경우 handCards, roleType 빈 값
          // target인 경우 본인이 아니어도 roleType을 알고있어야 한다고 함
          // handCards는 본인이 아닌경우 아무도 볼 수 없음.
          if (user.id !== me.id) {
            const otherUser = user.makeRawObject();
            otherUser.character.handCards = []; // 본인이 아닌 경우 handCards는 빈 배열
            if (otherUser.character.roleType !== Packets.RoleType.TARGET) {
              otherUser.character.roleType = Packets.RoleType.NONE_ROLE; // TARGET이 아니면 NONE_ROLE
            }
            return otherUser;
          }
          return user.makeRawObject(); // 본인 데이터는 그대로 반환
        }),
      },
    },
  };
};

export default gamePrepareNotification;
