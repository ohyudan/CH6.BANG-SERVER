import HANDLER_IDS from '../../constants/handlerIds';
import playerList from '../../model/player/playerList.class';
import userUpdateNotification from '../../utils/notification/userDataUpdate.notification';
import { createResponse } from '../../utils/response/createResponse';

const destroyCardHandler = async ({ socket, payload }) => {
  const destroyCards = payload; // 버릴 카드의 배열[{ cardType, count }, { cardType, count }] 한장씩 버리는거면 따로 올듯?

  const player = playerList.getPlayer(socket.id);

  player.removeHandCard(destroyCards); // 배열로 온다면 배열 길이만큼 반복문을 만들어서 카드를 제거 하면 되지 않을까

  const S2CDestroyCardResponse = { CardData: player.handCards }; // 버린 이후 가지고 있는 카드
  const gamePacket = { destroyCardResponse: S2CDestroyCardResponse };
  const response = createResponse(
    HANDLER_IDS.DESTROY_CARD_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  socket.write(response)
  userUpdateNotification()
};

export default destroyCardHandler;
