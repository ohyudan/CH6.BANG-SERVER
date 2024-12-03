import { CARD_TYPE } from '../../constants/card.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../response/createFailCode.js';
import { createResponse } from '../response/createResponse.js';


const hallucination = ({ socket, cardType,targetUserId }) => {
console.time("신기루.");
const user = playerList.getPlayer(socket.id);
const room = roomList.getRoom(user.currentRoomId);
const targetUser = playerList.getPlayer(targetUserId.low);
const userState=user.characterData.stateInfo.state;
const targetUserState=targetUser.characterData.stateInfo.state;
//13 신기루 시전
//14 신기루 대상
user.setCharacterStateType(CHARACTER_STATE_TYPE.HALLUCINATING);
targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.HALLUCINATION_TARGET);
console.log(`유저의 상태:  ${user.characterData.stateInfo.state}
             타겟의 상태: ${targetUser.characterData.stateInfo.state}`);


const inGameUsers = Array.from(room.getAllPlayers().values());

const S2CUseCardNotification = {
    cardType: cardType,
    userId: user.id,
    targetUserId:0,
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
console.timeEnd("신기루.");
return {
    success: true,
    failCode: createFailCode(0),
};
};

export default hallucination;