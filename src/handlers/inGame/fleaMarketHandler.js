import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../../utils/response/createFailCode.js';
import { createResponse } from '../../utils/response/createResponse.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { fleaMarketMap } from '../../utils/notification/card/fleaMarketNotification.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import TimerFleaMarket from '../../utils/FleaMarket/TimerFleaMarket.js';

const fleaMaketHanlder = async ({ socket, payload }) => {
  const { pickIndex } = payload;

  const pickupCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(pickupCardPlayer.currentRoomId);
  const { userSequenceQueue, cardMarketData } = fleaMarketMap.get(room.id);

  const roomJoinPlayer = room.getAllPlayers();
  const userMakeData = [];
  userSequenceQueue.dequeue();
  roomJoinPlayer.forEach((values) => {
    if (pickupCardPlayer.id == values.id) {
      values.setCharacterStateType(CHARACTER_STATE_TYPE.FLEA_MARKET_WAIT);

      values.characterData.handCards.push(cardMarketData[pickIndex]);
      cardMarketData.splice(pickIndex, 1);
    } else if (userSequenceQueue.peek().id == values.id) {
      values.setCharacterStateType(CHARACTER_STATE_TYPE.FLEA_MARKET_TURN);
    }
    userMakeData.push(values.makeRawObject());
  });

  const S2CFleaMarketPickResponse = {
    success: true,
    failCode: createFailCode(0),
  };
  const gamePacketPickupResponse = { fleaMarketPickResponse: S2CFleaMarketPickResponse };

  const resultPickupResponse = createResponse(
    HANDLER_IDS.FLEA_MARKET_PICK_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacketPickupResponse,
  );

  socket.write(resultPickupResponse);

  roomJoinPlayer.forEach((values) => {
    const S2CUserUpdateNotification = {
      user: userMakeData,
    };

    const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };
    const result = createResponse(
      HANDLER_IDS.USER_UPDATE_NOTIFICATION,
      values.socket.version,
      values.socket.sequence,
      gamePacket,
    );
    values.socket.write(result);
  });
  const gamePacketFleaMarketNotification = createResponse(
    HANDLER_IDS.FLEA_MARKET_NOTIFICATION,
    socket.version,
    socket.sequence,
    gamePacketfleaMarket,
  );
  roomJoinPlayer.forEach((values) => {
    values.socket.write(gamePacketFleaMarketNotification);
  });

  if (userSequenceQueue.isEmpty()) {
    userSequenceQueue.clear();
    fleaMarketMap.delete(room.id);
  } else {
    TimerFleaMarket(userSequenceQueue.peek(), roomJoinPlayer, 10);
  }
};
export default fleaMaketHanlder;
// message C2SFleaMarketPickRequest {
//     int32 pickIndex = 1;
// }

// message S2CFleaMarketPickResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }
