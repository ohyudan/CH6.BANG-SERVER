import HANDLER_IDS from '../../constants/handlerIds.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../response/createFailCode.js';
import { createResponse } from '../response/createResponse.js';

const weapon = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);

  const useWeapon = user.characterData.handCards.find((card) => card.type === cardType);

  if (!useWeapon) {
    return { success: false, failCode: createFailCode(11) };
  }

  if (useWeapon.count >= 2) {
    useWeapon.count--;
    user.characterData.handCardsCount--;
  } else {
    const weaponIndex = user.characterData.handCards.findIndex((card) => card.type === cardType);
    user.characterData.handCards.splice(weaponIndex, 1);
    user.characterData.handCardsCount--;
  }

  // 사용한 카드를 룸의 덱에 추가해야하는데.. 자료?구조

  user.characterData.weapon = useWeapon.type;

  const inGameUsers = Array.from(room.getAllPlayers().values());

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: user.id,
    targetUserId: 0,
  };

  inGameUsers.forEach((player) => {
    const gamePacket = { useCardNotification: S2CUseCardNotification };

    const useCardNotification = createResponse(
      HANDLER_IDS.USE_CARD_NOTIFICATION,
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

  return { success: true, failCode: createFailCode(0) };
};

export default weapon;
