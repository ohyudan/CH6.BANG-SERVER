import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

const call119Notification = ({ socket, cardType, targetUserId }) => {
  const useCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(useCardPlayer.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();
  let failCode = null;
  let success = null;
  const userMakeData = [];

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: socket.id,
    targetUserId: socket.id,
  };

  try {
    console.log(`119 카드 사용자 ID: ${socket.id}, 타겟 ID: ${targetUserId}`);
    // 카드 제거
    useCardPlayer.removeHandCard(CARD_TYPE.CALL_119);
    console.log(`${socket.id}번 사용자의 119카드가 제거 되었습니다.`);

    // 타겟이 자신인 경우, 체력 1 회복
    if (socket.id === targetUserId) {
      console.log(`${socket.id} 자신의 체력 1회복`);
      useCardPlayer.increaseHp();
    } else {
      // 타겟이 나 아닌 경우, 다른 유저들 체력 1 회복
      console.log(`${socket.id} 자신을 제외한 다른 유저들 체력 1회복`);
      roomInJoinPlayerList.forEach((player) => {
        if (socket.id !== player.id) {
          console.log(`${player.id}의 체력이 회복됩니다.`);
          player.increaseHp();
        }
      });
    }

    // 모든 유저에게 카드 사용 알림
    roomInJoinPlayerList.forEach((player) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);

      userMakeData.push(player.makeRawObject());
    });

    // 모든 유저에게 사용자 업데이트 전송
    roomInJoinPlayerList.forEach((values) => {
      const S2CUserUpdateNotification = { user: userMakeData };
      const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };

      const result = createResponse(
        HANDLER_IDS.USER_UPDATE_NOTIFICATION,
        values.socket.version,
        values.socket.sequence,
        gamePacket,
      );
      values.socket.write(result);
    });

    success = true;
    failCode = createFailCode(0); // 성공 코드
    console.log(`119 카드 사용 성공 ${failCode}`);
  } catch (err) {
    console.error(`CALL119 실행 중 에러 발생! 에러 메시지: ${err.message}`);
    success = false;
    failCode = createFailCode(1);
  }

  return { success, failCode };
};

export default call119Notification;
