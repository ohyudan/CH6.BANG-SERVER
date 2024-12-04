import { CARD_TYPE } from '../../constants/card.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import createFailCode from '../response/createFailCode.js';
import { createResponse } from '../response/createResponse.js';

const hallucination = ({ socket, cardType, targetUserId }) => {
    const user = playerList.getPlayer(socket.id);
    const room = roomList.getRoom(user.currentRoomId);
    const targetUser = playerList.getPlayer(targetUserId.low);

    let success = null;
    let failCode = null;
    //캐릭터가 카드가 없을떄
    if (targetUser.characterData.handCards.length === 0 && targetUser.characterData.weapon === 0 && targetUser.characterData.equips.length === 0) {
        const S2CUserUpdateNotification = { user: user.getAllUsersData() };

        const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const userUpdateNotification = createResponse(
            HANDLER_IDS.USER_UPDATE_NOTIFICATION,
            socket.version,
            socket.sequence,
            updatePacket,
        );

        socket.write(userUpdateNotification);

        success = false;
        failCode = createFailCode(11);

        return { success, failCode };
    }
    if (targetUser.characterData.stateInfo.state === CHARACTER_STATE_TYPE.NONE_CHARACTER_STATE ||
        targetUser.characterData.stateInfo.state === CHARACTER_STATE_TYPE.CONTAINED) {//상태 설정
        user.setNextCharacterStateType(user.characterData.stateInfo.state);
        user.setCharacterStateType(CHARACTER_STATE_TYPE.HALLUCINATING);
        user.setStateTargetUserId(targetUserId.low);

        targetUser.setNextCharacterStateType(targetUser.characterData.stateInfo.state);
        targetUser.setCharacterStateType(CHARACTER_STATE_TYPE.HALLUCINATION_TARGET);
        targetUser.setStateTargetUserId(user.id);

        //카드제거 
        user.removeHandCard(CARD_TYPE.HALLUCINATION);
        user.characterData.handCardsCount--;

        const inGameUsers = Array.from(room.getAllPlayers().values());

        const S2CUseCardNotification = {
            cardType: cardType,
            userId: user.id,
            targetUserId: targetUserId.low,
        };
        const gamePacket = { useCardNotification: S2CUseCardNotification };

        inGameUsers.forEach((player) => {
            const useCardNotification = createResponse(
                HANDLER_IDS.USE_CARD_NOTIFICATION,
                player.socket.version,
                player.socket.sequence,
                gamePacket,
            );

            player.socket.write(useCardNotification);

            const S2CUserUpdateNotification = { user: player.getAllUsersData() };

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
    }
    else {
        const S2CUserUpdateNotification = { user: user.getAllUsersData() };

        const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };

        const userUpdateNotification = createResponse(
            HANDLER_IDS.USER_UPDATE_NOTIFICATION,
            socket.version,
            socket.sequence,
            updatePacket,
        );

        socket.write(userUpdateNotification);

        success = false;
        failCode = createFailCode(10);
    }

    return { success, failCode };
};

export default hallucination;