import { ANIMATION_TYPE, CARD_TYPE } from '../../constants/card.enum.js';
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

  // 타겟 유저가 현재 NONE 상태일 때 발사 가능하게 처리
  if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.GUERRILLA_TARGET) {
    // 타겟 유저가 없으면 -> 게릴라, 현피

    const roomInJoinPlayerList = room.getAllPlayers();
    const userMakeData = [];

    const S2CUseCardNotification = {
      cardType: cardType,
      userId: socket.id,
      targetUserId: targetUserId.low,
    };

    roomInJoinPlayerList.forEach((player) => {
      if (!(socket.id === player.id)) {
        const gamePacket = { useCardNotification: S2CUseCardNotification };

        const result = createResponse(
          HANDLER_IDS.USE_CARD_NOTIFICATION,
          socket.version,
          socket.sequence,
          gamePacket,
        );

        player.socket.write(result);
      } else {
        player.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
        player.removeHandCard(CARD_TYPE.BBANG);
      }
      userMakeData.push(player.makeRawObject());
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
    // 현재 유저가 NONE 상태라면 타겟 유저 데이터가 존재해야 정상
    // if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE) {
    //   return {
    //     success: false,
    //     failCode: createFailCode(9),
    //   };
    // }
  } else {
    // 타겟 유저가 존재할 때 -> 현재 유저의 상태가 NONE이고 상대가 NONE이면 발사 진행
    if (
      user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE &&
      targetUser.characterData.stateInfo.state === CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE
    ) {
      // 유저의 무기별 발사 횟수 검증
      // 유저가 레드or자동소총 발수 제약없음 / 아니면 핸드건은 2발 제한 나머진 1발
      if (
        !(
          user.characterData.characterType === CHARACTER_TYPE.RED ||
          user.characterData.weapon === CARD_TYPE.AUTO_RIFLE
        )
      ) {
        // 핸드건인 경우 2발 제한
        if (
          user.characterData.weapon === CARD_TYPE.HAND_GUN &&
          user.characterData.bbangCount >= 2
        ) {
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

          return { success: false, failCode: createFailCode(14) };
        }

        // 나머지 무기는 1발 제한
        if (
          user.characterData.weapon !== CARD_TYPE.HAND_GUN &&
          user.characterData.bbangCount >= 1
        ) {
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

          return { success: false, failCode: createFailCode(14) };
        }
      } // 발사 횟수 검증 끝

      // 카드를 유저의 핸드에서 제거
      const useBbangCard = user.characterData.handCards.find(
        (card) => card.type === CARD_TYPE.BBANG,
      );

      if (!useBbangCard) {
        return { success: false, failCode: createFailCode(11) };
      }

      user.removeHandCard(CARD_TYPE.BBANG);
      user.characterData.handCardsCount--;
      // 카드를 핸드에서 제거 끝

      // 뱅 발사횟수 1 증가
      user.increaseBbangCount();

      // 제거한 카드 룸의 덱에 추가
      // room.deckUseCardAdd(CARD_TYPE.BBANG);

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

          const S2CAnimationNotification = {
            userId: targetUserId.low,
            animationType: ANIMATION_TYPE.SHIELD_ANIMATION,
          }

          inGameUsers.forEach((player) => {
            const gamePacket = { useCardNotification: S2CUseCardNotification };

            const useCardNotification = createResponse(
              HANDLER_IDS.USE_CARD_NOTIFICATION,
              player.socket.version,
              player.socket.sequence,
              gamePacket,
            );

            player.socket.write(useCardNotification);

            const animationPacket = { animationNotification: S2CAnimationNotification };

            const animationNotification = createResponse(
              HANDLER_IDS.ANIMATION_NOTIFICATION,
              player.socket.version,
              player.socket.sequence,
              animationPacket,
            );

            player.socket.write(animationNotification);
          });

          userUpdateNotification(room);

          // 종료 response 성공 반환
          return { success: true, failCode: createFailCode(0) };
        }
      } // 개구리군 검증 끝

      // 상대가 오토 쉴드를 가지고 있는 경우
      if (targetUser.characterData.equips.includes(CARD_TYPE.AUTO_SHIELD)) {
        // 자동 쉴드 확률 25% 성공 시 뱅 종료
        if (Math.floor(Math.random() * 4) === 0) {
          // 회피 성공

          // 카드 사용 알림
          const S2CUseCardNotification = {
            cardType: cardType,
            userId: user.id,
            targetUserId: targetUserId.low,
          };

          const S2CAnimationNotification = {
            userId: targetUserId.low,
            animationType: ANIMATION_TYPE.SHIELD_ANIMATION,
          }

          inGameUsers.forEach((player) => {
            const gamePacket = { useCardNotification: S2CUseCardNotification };

            const useCardNotification = createResponse(
              HANDLER_IDS.USE_CARD_NOTIFICATION,
              player.socket.version,
              player.socket.sequence,
              gamePacket,
            );

            player.socket.write(useCardNotification);

            const animationPacket = { animationNotification: S2CAnimationNotification };

            const animationNotification = createResponse(
              HANDLER_IDS.ANIMATION_NOTIFICATION,
              player.socket.version,
              player.socket.sequence,
              animationPacket,
            );

            player.socket.write(animationNotification);
          });

          userUpdateNotification(room);

          // 종료 response 성공 반환
          return { success: true, failCode: createFailCode(0) };
        }
      } // 오토쉴드 검증 끝

      // // 쉴드가 1개라도 있으면 대처가능 UI 발생은 클라에서 처리되는 것 확인 완료 // 상어군일경우도 클라에서 처리되는거 확인완료

      // 아래 2줄은 필수 아닌거 확인완료
      // user.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_SHOOTER);
      // user.setStateTargetUserId(targetUser.id);

      targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.BBANG_TARGET);
      targetUser.setStateTargetUserId(user.id);

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
      });

      userUpdateNotification(room);

      return {
        success: true,
        failCode: createFailCode(0),
      };
      // bbang 발사 완료
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
  }
};

export default bbang;
