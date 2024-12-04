import { createResponse } from '../../response/createResponse.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

/**
 * 게임 준비 알림 데이터를 생성
 * @param {Room} room - 방 객체
 * @param {Player} me - 알림을 받는 플레이어
 * @returns {object} - 알림 데이터
 */
const gamePrepareNotification = (room, owner) => {
  const roomPlayList = room.getAllPlayers();

  roomPlayList.forEach((values, key) => {
    //if (owner.id !== key)
    {
      const S2CGamePrepareNotification = {
        room: room.getRoomData(),
      };
      const gamePacket = { gamePrepareNotification: S2CGamePrepareNotification };

      const result = createResponse(
        HANDLER_IDS.GAME_PREPARE_NOTIFICATION,
        values.socket.version,
        values.socket.sequence,
        gamePacket,
      );

      values.socket.write(result);
    }
  });
  // return {
  //   gamePrepareNotification: {
  //     room: {
  //       id: room.id,
  //       ownerId: room.ownerId,
  //       name: room.name,
  //       maxUserNum: room.maxUserNum,
  //       state: room.getState(), // 방 상태
  //       users: room.getAllPlayers().map((player) => {
  //         // 본인이 아닌 경우 or target이 아닌 경우 handCards, roleType 빈 값
  //         // target인 경우 본인이 아니어도 roleType을 알고있어야 한다고 함
  //         // handCards는 본인이 아닌경우 아무도 볼 수 없음.
  //         if (player.id !== me.id) {
  //           const otherPlayer = player.makeRawObject();
  //           otherPlayer.character.handCards = []; // 본인이 아닌 경우 handCards는 빈 배열
  //           if (otherPlayer.character.roleType !== Packets.RoleType.TARGET) {
  //             otherPlayer.character.roleType = Packets.RoleType.NONE_ROLE; // TARGET이 아니면 NONE_ROLE
  //           }
  //           return otherPlayer;
  //         }
  //         return player.makeRawObject(); // 본인 데이터는 그대로 반환
  //       }),
  //     },
  //   },
  // };
};

export default gamePrepareNotification;
// message S2CGamePrepareNotification {
//   RoomData room = 1;
// }
