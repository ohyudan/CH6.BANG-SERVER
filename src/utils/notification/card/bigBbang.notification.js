import createFailCode from '../../response/createFailCode.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import bigBnangShooterNotification from '../state/bigBbangShooter.notification.js';

const bigBbangNotification = async ({ socket, cardType, targetUserId }) => {
  const useCardPlayer = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(useCardPlayer.currentRoomId);
  const roomInJoinPlayerList = room.getAllPlayers();

  let failCode = null;
  let success = null;
  //const backupPlayerData = room.getAllPlayers(); // 얕은 복사 의미 없음 추후 더 고려해서 작성

  const userMakeData = [];
  const S2CUseCardNotification = {
    cardType: CARD_TYPE.BIG_BBANG,
    userId: socket.id,
    targetUserId: useCardPlayer.id,
  };

  // 이미 상호작용 중인 사람이 있으면 실행되지 않고 
  // 룸의 playList에 카드를 사용한 사람의 id와 사용한 카드(게릴라, 무차별)의 데이터를 저장한다.
  // 게릴라, 무차별 난사의 마지막 한 사람까지 상호작용이 끝났다면 playList에 저장된 데이터를 사용해 시전한다.
  let cannotUse = false;

  roomInJoinPlayerList.forEach((player) => {
    // NONE 또는 CONTAINED가 아닌 상태가 있는 경우 cannotUse = true
    if (
      player.characterData.stateInfo.state !== CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE &&
      player.characterData.stateInfo.state !== CHARACTER_STATE_TYPE.CONTAINED
    ) {
      cannotUse = true;
    }
  });

  if (cannotUse) {
    room.addCardPlayList(useCardPlayer.id, cardType);
    useCardPlayer.removeHandCard(CARD_TYPE.BIG_BBANG);
    useCardPlayer.decreaseHandCardsCount();

    roomInJoinPlayerList.forEach((player) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);
    })

    success = true;
    failCode = createFailCode(0);

    return { success, failCode };
  }

  try {
    roomInJoinPlayerList.forEach((player) => {
      if (!(socket.id === player.id)) {
        const gamePacket = { useCardNotification: S2CUseCardNotification };

        const result = createResponse(
          HANDLER_IDS.USE_CARD_NOTIFICATION,
          player.socket.version,
          player.socket.sequence,
          gamePacket,
        );
        player.socket.write(result);
        player.setCharacterStateType(CHARACTER_STATE_TYPE.BIG_BBANG_TARGET);
        player.setStateTargetUserId(useCardPlayer.id);
        userMakeData.push(player.makeRawObject());
      } else {
        player.setCharacterStateType(CHARACTER_STATE_TYPE.BIG_BBANG_SHOOTER);
        player.setStateTargetUserId(0);
        useCardPlayer.removeHandCard(CARD_TYPE.BIG_BBANG);
        useCardPlayer.decreaseHandCardsCount();
        userMakeData.push(player.makeRawObject());
      }
    });

    roomInJoinPlayerList.forEach((values) => {
      const S2CUserUpdateNotification = {
        user: userMakeData,
      };
      const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };
      const result = createResponse(
        HANDLER_IDS.USER_UPDATE_NOTIFICATION,
        socket.version,
        socket.sequence,
        gamePacket,
      );
      values.socket.write(result);
    });

    success = true;
    failCode = createFailCode(0);

    bigBnangShooterNotification({ socket, player: useCardPlayer });
  } catch (err) {
    success = false;
    failCode = createFailCode(1);
  }
  return { success, failCode };
};

export default bigBbangNotification;
// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 0

// message S2CCardEffectNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     bool success = 3;
// }

// S2CUserUpdateNotification userUpdateNotification = 33;
// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }
