import { CARD_TYPE } from '../../constants/card.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../response/createFailCode.js';
import { createResponse } from '../response/createResponse.js';

const equip = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);

  const useEquip = user.characterData.handCards.find((card) => card.type === cardType);

  if (!useEquip) {
    return { success: false, failCode: createFailCode(11) };
  }


  // 사용한 방어구를 equips 배열에 추가 -> 이미 장착한 상태인지 구별
  const findEquip = user.characterData.equips.includes(cardType);
  if (!findEquip) {
    user.characterData.equips.push(useEquip.type); // 장비 장착

    const { card, index } = user.characterData.getCardsearch(cardType);
    user.characterData.handCards.splice(index, 1); // 장비 카드를 손에서만 제거
  } else {
    // 이미 장착한 방어구면 바로 덱으로 반환
    user.removeHandCard(cardType);
  }

  user.characterData.handCardsCount--;
  const inGameUsers = Array.from(room.getAllPlayers().values());

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: user.id,
    targetUserId: targetUserId.low,
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

export default equip;
