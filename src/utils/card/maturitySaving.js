import { CARD_TYPE } from '../../constants/card.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../response/createFailCode.js';
import { createResponse } from '../response/createResponse.js';

//타겟이 은행npc  targetUserId 필요없는것 같기도.
const maturitySaving = ({ socket, cardType }) => {
console.log("maturitySaving");
const user = playerList.getPlayer(socket.id);
const room = roomList.getRoom(user.currentRoomId);
//const targetUser = playerList.getPlayer(targetUserId.low);
//2장 드로우및 핸드수 증가.

for(let i=0;i<2;i++)
{
    console.log(`드로우 카드수:${i+1}`);
    user.addHandCard();
    user.increaseHandCardsCount();
}

//핸드에서 해당카드제거 및 핸드수 줄임
user.removeHandCard(CARD_TYPE.MATURED_SAVINGS);
user.characterData.handCardsCount--;
const inGameUsers = Array.from(room.getAllPlayers().values());

const S2CUseCardNotification = {
    cardType: cardType,
    userId: user.id,
    targetUserId:socket.id,
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

    const S2CUserUpdateNotification = { user: player.getAllUsersData()};

    const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

    const userUpdateNotification = createResponse(
    HANDLER_IDS.USER_UPDATE_NOTIFICATION,
    player.socket.version,
    player.socket.sequence,
    updatePacket,
    );

    player.socket.write(userUpdateNotification);
});

return {
    success: true,
    failCode: createFailCode(0),
};
};

export default maturitySaving;