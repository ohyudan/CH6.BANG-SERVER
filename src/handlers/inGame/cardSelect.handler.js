import { CARD_TYPE } from '../../constants/card.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import CardData from '../../model/card/cardData.class.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import userUpdateNotification from '../../utils/notification/user/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

const cardSelectHandler = ({ socket, payload }) => {
  console.log(payload);
  const { selectType, selectCardType } = payload;
  // 핸드카드를 선택하면 둘다 0으로 옴 -> 맨앞이던 맨뒤던 다 0으로
  // 방어구는 1 ->  방어구타입 번호
  // 무기는 2 -> 무기타입 번호
  // 디버프는 3 -> 디버프 번호인데 감금은 상태(감금), 디버프(감금) 같이 있음.
  // 감금을 건드린다면 다음 상태를 none으로 바꿔줄 필요 있다.
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);

  try {
    let targetCard = null;

    const targetUser = playerList.getPlayer(user.characterData.stateInfo.stateTargetUserId);

    switch (selectType) {
      case 0: {
        // 핸드카드 한 장
        const randomIndex = Math.floor(targetUser.characterData.handCards.length*Math.random());
        targetCard = targetUser.characterData.handCards[randomIndex];
        if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.ABSORBING) {
          user.characterData.handCards.push(targetCard);
          user.increaseHandCardsCount();
          targetUser.characterData.handCards.splice(randomIndex, 1);
          targetUser.decreaseHandCardsCount();
        } else if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.HALLUCINATING) {
          targetUser.removeHandCard(targetCard.type);
          targetUser.decreaseHandCardsCount();
        }
        break;
      }
      case 1: {
        // 방어구
        const targetCardIndex = targetUser.characterData.equips.findIndex(
          (equip) => equip === selectCardType,
        );
        targetCard = targetUser.characterData.equips[targetCardIndex];
        if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.ABSORBING) {
          user.characterData.handCards.push(new CardData(targetCard));
          user.increaseHandCardsCount();
          targetUser.characterData.equips.splice(targetCardIndex, 1);
        } else if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.HALLUCINATING) {
          targetUser.removeEquip(selectCardType);
        }
        break;
      }
      case 2: {
        // 무기
        targetCard = targetUser.characterData.weapon;
        if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.ABSORBING) {
          user.characterData.handCards.push(new CardData(targetCard));
          user.increaseHandCardsCount();
          targetUser.characterData.weapon = 0;
        } else if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.HALLUCINATING) {
          targetUser.removeWeapon();
        }
        break;
      }
      case 3: {
        // 디버프
        const targetCardIndex = targetUser.characterData.debuffs.findIndex((debuff) => debuff === selectCardType);
        targetCard = targetUser.characterData.debuffs[targetCardIndex];
        if (targetCard === CARD_TYPE.CONTAINMENT_UNIT) {
          // 감금 카드를 흡수나 신기루로 건드리면 타겟유저의 다음 상태를 NONE으로 바꿔 감금이 해제되도록
          targetUser.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
        }

        if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.ABSORBING) {
          user.characterData.handCards.push(new CardData(targetCard));
          user.increaseHandCardsCount();
          targetUser.characterData.debuffs.splice(targetCardIndex, 1);
        }
        else if (user.characterData.stateInfo.state === CHARACTER_STATE_TYPE.HALLUCINATING) {
          targetUser.removeDebuff(selectCardType);
        }
      }
    }

    user.setCharacterStateType(user.characterData.stateInfo.nextState);
    user.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    user.setStateTargetUserId(0);
    targetUser.setCharacterStateType(user.characterData.stateInfo.nextState);
    targetUser.setNextCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    targetUser.setStateTargetUserId(0);

    const S2CCardSelectResponse = {
      success: true, //success,
      failCode: 0, //failCode,
    };

    const gamePacket = {
      cardSelectResponse: S2CCardSelectResponse,
    };

    const cardSelectPacket = createResponse(
      HANDLER_IDS.CARD_SELECT_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    socket.write(cardSelectPacket);

    userUpdateNotification(room);
  } catch (err) {
    console.error(err);
  }
  // 상대방에게서 선택한 카드 데이터를 가져옴

  //   message S2CCardSelectResponse {
  //     bool success = 1;
  //     GlobalFailCode failCode = 2;
  // }
};

export default cardSelectHandler;
