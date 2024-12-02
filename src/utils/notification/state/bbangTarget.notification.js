import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import { CHARACTER_STATE_TYPE, CHARACTER_TYPE } from '../../../constants/user.enum.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';
import userUpdateNotification from '../user/userUpdate.notification.js';
import playerList from '../../../model/player/playerList.class.js';
import { CARD_TYPE } from '../../../constants/card.enum.js';

// state가 bbangTarget인 상태에서 피해 받기를 선택하면 실행되는 코드
// 상어군으로 공격하면 쉴드가 1개 이하일때 자동으로 피해받기에 들어가지는 것 확인 완료
const bbangTargetNotification = async ({ socket, player, reactionType }) => {
  try {
    const room = roomList.getRoom(player.currentRoomId);
    const targetUser = playerList.getPlayer(player.characterData.stateInfo.stateTargetUserId);
    const inGameUsers = Array.from(room.getAllPlayers().values());

    // 공격자의 무기가 D이글인지 아닌지로 받을 데미지 변동
    // 피해받기 전 체력 기록
    const playerHp = player.characterData.hp;
    if (targetUser.characterData.weapon === CARD_TYPE.DESERT_EAGLE) player.decreaseHp();
    player.decreaseHp();
    if (player.characterData.hp < 0) player.setHp(0);

    player.setCharacterStateType(CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE);
    player.setStateTargetUserId(0);

    const getDamage = playerHp - player.characterData.hp; // 받은 데미지 -> 말랑 데미지 계산에 사용

    // 피격자가 사망했고, 게임 내에 가면군 유저가 존재한다면 -> 사망한 피격자의 카드들을 가면군에게 전달
    const maskUser = inGameUsers.find(
      (user) => user.characterData.characterType === CHARACTER_TYPE.MASK,
    );

    // 피격자가 사망했으면
    if (player.characterData.hp <= 0) {
      // if () 사망한 유저에 따라 다른 유저들 승리조건 탐색?

      // 사망한 유저와 mask유저가 동일하면 계산x
      if (player !== maskUser && maskUser && player.characterData.handCardsCount > 0) {
        // 사망한 유저의 카드를 mask 캐릭터에게 전달
        player.characterData.handCards.forEach((card) => {
          maskUser.characterData.handCards.push(card);
          maskUser.increaseHandCardsCount();
        });
        player.characterData.handCards.splice(0);
        player.characterData.handCardsCount = 0;
      }

      // 사망한 유저에 따라 게임 엔드 처리?

      // 마스크맨 없으면 죽은 사람 카드 룸 덱으로 반환
      if (!maskUser && player.characterData.handCardsCount > 0) {
        player.characterData.handCards.forEach((card) => {
          room.deckUseCardAdd(card);
        });
        player.characterData.handCards.splice(0);
        player.characterData.handCardsCount = 0;
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
      const cardData = targetUser.characterData.handCards[0];
      player.characterData.handCards.push(cardData);
      player.increaseHandCardsCount();
      targetUser.characterData.handCards.splice(0, 1);
      targetUser.decreaseHandCardsCount();
    }

    userUpdateNotification(room);
  } catch (err) {
    console.error(err);
  }
};

export default bbangTargetNotification;
