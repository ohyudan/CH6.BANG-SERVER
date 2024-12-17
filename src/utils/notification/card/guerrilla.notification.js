import playerList from '../../../model/player/playerList.class.js';
import roomList from '../../../model/room/roomList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';
import { createResponse } from '../../response/createResponse.js';
import createFailCode from '../../response/createFailCode.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import guerrillaShooterNotification from '../state/guerrillaShooter.notification.js';

// 방어 기능 미구현(빵야! 로 방어 가능해야 함)
const guerrillaNotification = ({ socket, cardType, targetUserId }) => {
  const useCardPlayer = playerList.getPlayer(socket.id); // socket.id로 Player를 검색
  const room = roomList.getRoom(useCardPlayer.currentRoomId); // 방 정보
  const inGameUsers = room.getAllPlayers(); // 방의 모든 플레이어
  let failCode = null;
  let success = null;
  const userMakeData = [];

  const S2CUseCardNotification = {
    cardType: CARD_TYPE.GUERRILLA,
    userId: socket.id,
    targetUserId: useCardPlayer.id,
  };

  let cannotUse = false;

  // 이미 상호작용 중인 사람이 있으면 실행되지 않고
  // 룸의 playList에 카드를 사용한 사람의 id와 사용한 카드(게릴라, 무차별)의 데이터를 저장한다.
  // 게릴라, 무차별 난사의 마지막 한 사람까지 상호작용이 끝났다면 playList에 저장된 데이터를 사용해 시전한다.
  inGameUsers.forEach((player) => {
    if (
      player.characterData.stateInfo.state !== CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE &&
      player.characterData.stateInfo.state !== CHARACTER_STATE_TYPE.CONTAINED
    ) {
      cannotUse = true;
    }
  });

  if (cannotUse) {
    room.addCardPlayList(useCardPlayer.id, cardType);
    useCardPlayer.removeHandCard(CARD_TYPE.GUERRILLA);
    useCardPlayer.decreaseHandCardsCount();

    inGameUsers.forEach((player) => {
      const gamePacket = { useCardNotification: S2CUseCardNotification };

      const result = createResponse(
        HANDLER_IDS.USE_CARD_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        gamePacket,
      );
      player.socket.write(result);
    });

    success = true;
    failCode = createFailCode(0);

    return { success, failCode };
  }

  try {
    useCardPlayer.removeHandCard(CARD_TYPE.GUERRILLA); // 카드 삭제가 안되서 try catch 맨위로 올림
    useCardPlayer.decreaseHandCardsCount();
    // GUERRILLA 카드 사용 처리 (모든 플레이어에게 사용된 카드 알림 전송)
    inGameUsers.forEach((player) => {
      if (socket.id !== player.id) {
        const gamePacket = { useCardNotification: S2CUseCardNotification };

        const result = createResponse(
          HANDLER_IDS.USE_CARD_NOTIFICATION,
          player.socket.version,
          player.socket.sequence,
          gamePacket,
        );
        player.socket.write(result);
        player.setCharacterStateType(CHARACTER_STATE_TYPE.GUERRILLA_TARGET);
        player.setStateTargetUserId(useCardPlayer.id);
        userMakeData.push(player.makeRawObject());
      } else {
        player.setCharacterStateType(CHARACTER_STATE_TYPE.GUERRILLA_SHOOTER);
        player.setStateTargetUserId(0);
        userMakeData.push(player.makeRawObject());
      }
    });

    // 알림: 모든 플레이어에게 카드 사용 및 상태 업데이트 전송
    inGameUsers.forEach((values) => {
      // USER_UPDATE_NOTIFICATION 전송
      const S2CUserUpdateNotification = {
        user: userMakeData,
      };

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

    guerrillaShooterNotification({ socket, player: useCardPlayer });
  } catch (err) {
    console.error(`GUERRILLA 실행 중 에러 발생: ${err.message}`);
    success = false;
    failCode = createFailCode(1);
  }
  return { success, failCode };
};
export default guerrillaNotification;
