import HANDLER_IDS from '../../constants/handlerIds.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import userUpdateNotification from '../../utils/notification/userDataUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

const destroyCardHandler = async ({ socket, payload }) => {
  const { destroyCards } = payload; // 버릴 카드의 배열[{ cardType, count }, { cardType, count }]

  const player = playerList.getPlayer(socket.id);

  destroyCards.forEach((value) => {
    player.removeHandCard(value.type);
    player.decreaseHandCardsCount();
  });

  console.log(player.characterData.handCards);

  const S2CDestroyCardResponse = { handCards: player.characterData.handCards }; // 버린 이후 가지고 있는 카드
  const gamePacket = { destroyCardResponse: S2CDestroyCardResponse };
  const response = createResponse(
    HANDLER_IDS.DESTROY_CARD_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(response);
  const roomId = player.currentRoomId();
  const room = roomList.getRoom(roomId);
  userUpdateNotification(room);
};

export default destroyCardHandler;
