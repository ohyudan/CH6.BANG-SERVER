import { CARD_TYPE } from '../../../constants/card.enum.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import playerList from '../../../model/player/playerList.class.js';
import roomList from '../../../model/room/roomList.class.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import TimerFleaMarket from '../../FleaMarket/TimerFleaMarket.js';
import DataQueue from '../../../model/dataQueue.js';

// 타이머 O 완료
// 순서 큐 하나 완료
// 보내놓고 원복 시켜야됨 nextAt 타임 공용임

const fleaMaketNotification = async ({ socket, cardType, targetUserId }) => {
  const useCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(useCardPlayer.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();
  let failCode = null;
  let success = null;

  // 셋팅
  let userMakeData = [];
  // 플리마켓
  let cardMarketData = [];

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: socket.id,
    targetUserId: targetUserId.low,
  };

  for (let i = 0; i < roomInJoinPlayerList.size; i++) {
    const carddata = room.cardDraw();
    cardMarketData.push(carddata.type);
  }

  const S2CFleaMarketNotification = { cardTypes: cardMarketData, pickIndex: 0 };

  const gamePacketfleaMarket = { fleaMarketNotification: S2CFleaMarketNotification };

  const gamePacketFleaMarketNotification = createResponse(
    HANDLER_IDS.FLEA_MARKET_NOTIFICATION,
    socket.version,
    socket.sequence,
    gamePacketfleaMarket,
  );

  const userSequenceQueue = new DataQueue();

  try {
    let isRoomJoinFirst = true;
    let firstPlayer;

    roomInJoinPlayerList.forEach((values) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        values.socket.version,
        values.socket.sequence,
        gamePacket,
      );
      if (isRoomJoinFirst) {
        values.setCharacterStateType(CHARACTER_STATE_TYPE.FLEA_MARKET_TURN);
        firstPlayer = values;
        isRoomJoinFirst = false;
      } else {
        values.setCharacterStateType(CHARACTER_STATE_TYPE.FLEA_MARKET_WAIT);
      }

      if (socket.id == values.id) {
        values.removeHandCard(CARD_TYPE.FLEA_MARKET);
        values.characterData.handCardsCount--;
      } else {
        values.socket.write(result);
      }
      userSequenceQueue.enqueue(values);
      userMakeData.push(values.makeRawObject());
    });

    roomInJoinPlayerList.forEach((values) => {
      values.socket.write(gamePacketFleaMarketNotification);
    });

    fleaMarketMap.set(room.id, { userSequenceQueue, cardMarketData });
    TimerFleaMarket(firstPlayer, roomInJoinPlayerList, 10);

    success = true;
    failCode = createFailCode(0);
  } catch (error) {
    success = false;
    failCode = createFailCode(1);
    console.error('플리마켓 ' + error);
  }
  return { success, failCode };
};

// id / 큐
const fleaMarketMap = new Map();

export { fleaMaketNotification, fleaMarketMap };

// S2CFleaMarketNotification fleaMarketNotification = 30;
//         C2SFleaMarketPickRequest fleaMarketPickRequest = 31;
//         S2CFleaMarketPickResponse fleaMarketPickResponse = 32;

// message S2CFleaMarketNotification {
//     repeated CardType cardTypes = 1;
//     repeated int32 pickIndex = 2;
// }

//현재 생존 유저 수 만큼 카드를 공개 후 입장순서대로 한장씩 갖는다
