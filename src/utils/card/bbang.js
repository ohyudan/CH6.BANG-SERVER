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

  // 현피 상태? 게릴라? 다른 처리가 필요할듯
  // if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.DEATH_MATCH_TURN_STATE?.DEATH_MATCH_STATE) {}

  // 타겟 유저가 현재 NONE 상태일 때 발사 가능하게 처리 // 이거 클라에서 어떻게 처리되는지 확인필요 -> 클라에서 발사가 안되면 처리할 필요x
  if (targetUser.characterData.stateInfo.state === CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE) {
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

        // 사용자 자신의 정보만 업데이트
        const S2CUserUpdateNotification = { user: user.getAllUsersData() };

        const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const userUpdateNotification = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          socket.version,
          socket.sequence,
          updatePacket,
        );

        socket.write(userUpdateNotification);

        // userUpdateNotification(room);

        return { success: false, failCode: createFailCode(14) };
      }

      // 나머지 무기는 1발 제한
      if (user.characterData.weapon !== CARD_TYPE.HAND_GUN && user.characterData.bbangCount >= 1) {
        console.log('발사 실패: 이 무기는 1발로 제한');

        // 사용자 자신의 정보만 업데이트
        const S2CUserUpdateNotification = { user: user.getAllUsersData() };

        const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const userUpdateNotification = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          socket.version,
          socket.sequence,
          updatePacket,
        );

        socket.write(userUpdateNotification);

        // userUpdateNotification(room);

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

    // 개구리군이랑 오토쉴드 적용도 클라에서 처리되는지 확인 필요 -> 안되는거 확인 서버에서 처리할 필요가 있을듯
    // 상대 캐릭터가 개구리군일 경우
    if (targetUser.characterData.characterType === CHARACTER_TYPE.FROGGY) {
      // 자동 쉴드 확률 25% 성공 시 뱅 종료
      if (Math.floor(Math.random() * 4) === 0) {
        // 회피 성공

        // 카드 사용 알림
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

        // 종료 response 성공 반환
        return { success: true, failCode: createFailCode(0) };
      }
    }

    // 상대가 오토 쉴드를 가지고 있는 경우
    if (targetUser.characterData.equips.includes(CARD_TYPE.AUTO_SHIELD)) {
      // 자동 쉴드 확률 25% 성공 시 뱅 종료
      if (Math.floor(Math.random() * 4) === 0) {
        // 회피 성공

        // 카드 사용 알림
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

        // 종료 response 성공 반환
        return { success: true, failCode: createFailCode(0) };
      }
    }
    // // 쉴드가 1개라도 있으면 대처가능 UI 발생은 클라에서 처리되는 것 확인 완료 // 상어군일경우도 클라에서 처리되는거 확인완료

    // if (targetUser.characterData.handCards.find((card) => card.type === CARD_TYPE.SHIELD)) {
    // user.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_SHOOTER);
    // user.setStateTargetUserId(targetUser.id);
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
  } else {
    // 타겟이 NONE 상태가 아니라서 공격 진행x
    // 사용자 자신의 정보만 업데이트
    const S2CUserUpdateNotification = { user: user.getAllUsersData() };

    const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

    const userUpdateNotification = createResponse(
      HANDLER_IDS.USER_UPDATE_NOTIFICATION,
      socket.version,
      socket.sequence,
      updatePacket,
    );

    socket.write(userUpdateNotification);

    // userUpdateNotification(room);

    return {
      success: false,
      failCode: createFailCode(10),
    };
  }
};

export default bbang;
