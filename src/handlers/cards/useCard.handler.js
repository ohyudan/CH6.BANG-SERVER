import HANDLER_IDS from '../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../../utils/response/createFailCode.js';
import { createResponse } from '../../utils/response/createResponse.js';

const useCardHandler = ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;

  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);
  const targetUser = playerList.getPlayer(targetUserId.low);

  switch (cardType) {
    case 1: {
      user.increaseBbangCount();

      user.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_SHOOTER);
      user.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
      user.setNextStateAt(Date.now() + 10000);
      user.setStateTargetUserId(targetUser.id);

      targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_TARGET);
      targetUser.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
      targetUser.setNextStateAt(Date.now() + 10000);
      targetUser.setStateTargetUserId(user.id);

      targetUser.decreaseHp();

      const S2CUseCardResponse = {
        success: true,
        failCode: createFailCode(0),
      };

      const responsePacket = { useCardResponse: S2CUseCardResponse };

      const useCardResponse = createResponse(
        HANDLER_IDS.USE_CARD_RESPONSE,
        socket.version,
        socket.sequence,
        responsePacket,
      );

      socket.write(useCardResponse);

      const inGameUsers = Array.from(room.getAllPlayers().values());

      const S2CUseCardNotification = {
        cardType: cardType,
        userId: user.id,
        targetUserId: targetUser.id,
      };

      inGameUsers.forEach((player) => {
        const gamePacket = { useCardNotification: S2CUseCardNotification };

        const useCardNotification = createResponse(
          HANDLER_IDS.POSITION_UPDATE_NOTIFICATION,
          player.socket.version,
          player.socket.sequence,
          gamePacket,
        );

        player.socket.write(useCardNotification);

        const S2CUserUpdateNotification = { user: player.getAllUsersData() };

        const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const userUpdateNotification = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          player.socket.version,
          player.socket.sequence,
          updatePacket,
        );

        player.socket.write(userUpdateNotification);
      });

      // 상태 업데이트

      break;
    }
  }
};

export default useCardHandler;
