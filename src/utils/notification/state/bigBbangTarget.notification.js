import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import { CHARACTER_STATE_TYPE, CHARACTER_TYPE } from '../../../constants/user.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import playerList from '../../../model/player/playerList.class.js';
import CardData from '../../../model/card/cardData.class.js';
import userUpdateNotification from '../user/userUpdate.notification.js';

const bigBnangTargetNotification = async ({ socket, player, reactionType }) => {
  //console.log(reactionType); // 0 false 1 true 왜준거야.
  try {
    const room = roomList.getRoom(player.currentRoomId);
    const roomInJoinPlayerList = room.getAllPlayers();
    
    const targetUser = room.getPlayer(player.characterData.stateInfo.stateTargetUserId);
    // const targetUser = playerList.getPlayer(user.characterData.stateInfo.stateTargetUserId);
    const inGameUsers = Array.from(room.getAllPlayers().values());

    player.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    player.setStateTargetUserId(0);
    player.decreaseHp();

    let getDamage = 1;

    // 피격자가 사망했고, 게임 내에 가면군 유저가 존재한다면 -> 사망한 피격자의 카드들을 가면군에게 전달
    const maskUser = inGameUsers.find(
      (user) => user.characterData.characterType === CHARACTER_TYPE.MASK,
    );

    // 피격자가 사망했으면
    if (player.characterData.hp <= 0) {
      // 마스크 유저가 존재하고 피격자가 마스크 유저가 아니라면
      if (player !== maskUser && maskUser) {
        // 사망한 유저의 카드를 mask 캐릭터에게 전달

        // 손에 있는 카드 처리
        if (player.characterData.handCardsCount > 0) {
          player.characterData.handCards.forEach((card) => {
            maskUser.characterData.handCards.push(card);
            maskUser.increaseHandCardsCount();
          });
          player.characterData.handCards.splice(0);
          player.characterData.handCardsCount = 0;
        }

        // 장착한 무기 처리
        if (player.characterData.weapon !== 0) {
          maskUser.characterData.handCards.push(new CardData(player.characterData.weapon));
          maskUser.increaseHandCardsCount();
          player.characterData.weapon = 0;
        }

        // 장착한 장비 처리
        if (player.characterData.equips.length > 0) {
          player.characterData.equips.forEach((equip) => {
            maskUser.characterData.handCards.push(new CardData(equip));
            maskUser.increaseHandCardsCount();
          });
          player.characterData.equips.splice(0);
        }
      } else {
        // 나머지 처리
        // 손에 있는 카드 처리
        for (let i = 0; i < player.characterData.handCards.length; i++) {
          // player.removeHandCard(player.characterData.handCards[0].type);
          const card = player.characterData.handCards[i];
          player.notifyObservers('removeHandCard', card);
        }
        player.characterData.handCards.splice(0);
        player.characterData.handCardsCount = 0;

        // 장착한 무기 처리
        if (player.characterData.weapon !== 0) {
          player.removeWeapon();
        }

        // 장착한 장비 처리
        // if (player.characterData.equips.length > 0) {
        for (let i = 0; i < player.characterData.equips.length > 0; i++) {
          // player.removeEquip(player.characterData.equips[0]);
          const cardType = player.characterData.equips[i];
          const card = new CardData(cardType);
          player.notifyObservers('removeHandCard', card);
        }
        player.characterData.equips.splice(0);
      }
    }

    // 피격자가 생존했고, 피격자의 캐릭터가 말랑이라면 -> 받은 데미지 만큼 카드 드로우
    if (
      player.characterData.hp > 0 &&
      player.characterData.characterType === CHARACTER_TYPE.MALANG
    ) {
      for (let i = 0; i < getDamage; i++) {
        // 덱에서 카드 드로우
        player.addHandCard();
        player.increaseHandCardsCount();
      }
    }

    // 피격자가 생존했고, 피격자의 캐릭터가 슬라임이라면 -> 공격자의 핸드 카드를 1장 랜덤으로 훔침
    if (
      player.characterData.hp > 0 &&
      player.characterData.characterType === CHARACTER_TYPE.PINK_SLIME &&
      targetUser.characterData.handCardsCount > 0
    ) {
      // 공격자의 핸드에서 1장 가져옴
      const randomIndex = Math.floor(Math.random() * targetUser.characterData.handCards.length);
      const cardData = targetUser.characterData.handCards[randomIndex];
      player.characterData.handCards.push(cardData);
      player.increaseHandCardsCount();
      targetUser.characterData.handCards.splice(randomIndex, 1);
      targetUser.decreaseHandCardsCount();
    }

    // const userMakeData = [];

    // userMakeData.push(player.makeRawObject());
    // roomInJoinPlayerList.forEach((values) => {
    //   const S2CUserUpdateNotification = {
    //     user: userMakeData,
    //   };

    //   const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };
    //   const result = createResponse(
    //     HANDLER_IDS.USER_UPDATE_NOTIFICATION,
    //     socket.version,
    //     socket.sequence,
    //     gamePacket,
    //   );
    //   values.socket.write(result);
    // });

    userUpdateNotification(room);
  } catch (err) {
    console.error(err);
  }
};

export default bigBnangTargetNotification;
