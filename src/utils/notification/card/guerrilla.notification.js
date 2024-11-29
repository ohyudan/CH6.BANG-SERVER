import playerList from '../../../model/player/playerList.class.js';
import roomList from '../../../model/room/roomList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import { createResponse } from '../../response/createResponse.js';
import createFailCode from '../../response/createFailCode.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

// 방어 기능 미구현(빵야! 로 방어 가능해야 함)
const guerrillaNotification = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id); // socket.id로 Player를 검색
  const room = roomList.getRoom(user.currentRoomId); // 방 정보
  const inGameUsers = room.getAllPlayers(); // 방의 모든 플레이어
  let failCode = null;
  let success = null;
  const userMakeData = [];

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: socket.id,
    targetUserId: targetUserId.low, // 타겟이 없으면 0으로 설정
  };
  try {
    user.removeHandCard(CARD_TYPE.GUERRILLA); // 카드안사라져서 try catch 맨 위로 올림

    // GUERRILLA 카드 사용 처리 (모든 플레이어에게 사용된 카드 알림 전송)
    inGameUsers.forEach((player) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);
      if (socket.id !== player.id) {
        player.decreaseHp(); // 피해를 입힘
      }

      // 플레이어 데이터 저장
      userMakeData.push(player.makeRawObject());
    });

    // 알림: 모든 플레이어에게 카드 사용 및 상태 업데이트 전송
    inGameUsers.forEach((values) => {
      // USER_UPDATE_NOTIFICATION 전송
      const S2CUserUpdateNotification = { user: userMakeData };

      const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };
      const result = createResponse(
        HANDLER_IDS.USER_UPDATE_NOTIFICATION,
        values.socket.version,
        values.socket.sequence,
        updatePacket,
      );
      values.socket.write(result);
    });
    success = true;
    failCode = createFailCode(0);
  } catch (err) {
    console.error(`GUERRILLA 실행 중 에러 발생: ${err.message}`);
    success = false;
    failCode = createFailCode(1);
  }
  return { success, failCode };
};
export default guerrillaNotification;
