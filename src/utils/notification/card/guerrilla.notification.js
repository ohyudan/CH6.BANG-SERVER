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

  const inGameUsers = Array.from(room.getAllPlayers().values()); // 방의 모든 플레이어
  const targetUsers = inGameUsers.filter((player) => player.id !== socket.id); // 자신을 제외한 다른 플레이어
  let failCode = null;
  let success = null;
  const userMakeData = [];

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: socket.id,
    targetUserId: null,
  };
  try {
    // GUERRILLA 카드 사용 처리
    targetUsers.forEach((player) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);
      player.decreaseHp();

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
    user.removeHandCard(CARD_TYPE.GUERRILLA);
  } catch (err) {
    console.error(`GUERRILLA 실행 중 에러 발생: ${err.message}`);
    success = false;
    failCode = createFailCode(1);
  }
  return { success, failCode };
};
export default guerrillaNotification;
