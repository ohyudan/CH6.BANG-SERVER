import { CARD_TYPE } from '../../constants/card.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE, CHARACTER_TYPE } from '../../constants/user.enum.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../../utils/response/createFailCode.js';
import { createResponse } from '../../utils/response/createResponse.js';
import userUpdateNotification from '../notification/user/userUpdate.notification.js';

const bbang = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);
  const targetUser = playerList.getPlayer(targetUserId.low);
  const inGameUsers = Array.from(room.getAllPlayers().values());

  // 유저의 무기별 발사 횟수 검증
  // 유저가 레드or자동소총 발수 제약없음 / 아니면 핸드건은 2발 제한 나머진 1발
  if (
    !(
      user.characterData.characterType === CHARACTER_TYPE.RED ||
      user.characterData.weapon === CARD_TYPE.AUTO_RIFLE
    )
  ) {
    // 핸드건인 경우 2발 제한
    if (user.characterData.weapon === CARD_TYPE.HAND_GUN && user.characterData.bbangCount >= 2) {
      console.log('발사 실패: 핸드건은 2발로 제한');

      userUpdateNotification(room);

      return { success: false, failCode: createFailCode(14) };
    }

    // 나머지 무기는 1발 제한
    if (user.characterData.weapon !== CARD_TYPE.HAND_GUN && user.characterData.bbangCount >= 1) {
      console.log('발사 실패: 이 무기는 1발로 제한');

      userUpdateNotification(room);

      return { success: false, failCode: createFailCode(14) };
    }
  }

  // 카드를 유저의 핸드에서 제거
  const useBbangCard = user.characterData.handCards.find((card) => card.type === CARD_TYPE.BBANG);

  if (!useBbangCard) {
    return { success: false, failCode: createFailCode(11) };
  }

  user.removeHandCard(CARD_TYPE.BBANG);
  user.characterData.handCardsCount--;

  // 뱅 발사횟수 1 증가
  user.increaseBbangCount();

  // 제거한 카드 룸의 덱에 추가
  room.deckUseCardAdd(CARD_TYPE.BBANG);

  // // 쉴드가 1개라도 있으면 대처가능 UI 발생은 클라에서 처리
  // if (targetUser.characterData.handCards.find((card) => card.type === CARD_TYPE.SHIELD)) {
    user.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_SHOOTER);
    user.setStateTargetUserId(targetUser.id);
  //   user.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
  //   user.setNextStateAt(Date.now() + 10000);

    targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_TARGET);
    targetUser.setStateTargetUserId(user.id);
    // targetUser.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    //   targetUser.setNextStateAt(Date.now() + 10000);
  // }

  // targetUser.decreaseHp();

  const S2CUseCardNotification = {
    cardType: cardType,
    userId: user.id,
    targetUserId: targetUser.id,
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
  });

  userUpdateNotification(room);

  return {
    success: true,
    failCode: createFailCode(0),
  };
};

export default bbang;
