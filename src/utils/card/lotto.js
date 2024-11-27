    import { CARD_TYPE } from '../../constants/card.enum.js';
    import HANDLER_IDS from '../../constants/handlerIds.js';
    import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
    import playerList from '../../model/player/playerList.class.js';
    import roomList from '../../model/room/roomList.class.js';
    import createFailCode from '../../utils/response/createFailCode.js';
    import { createResponse } from '../../utils/response/createResponse.js';

    //타겟이 로또npc  targetUserId 필요없는것 같기도.
    const lotto = ({ socket, cardType,targetUserId }) => {

    const user = playerList.getPlayer(socket.id);
    const room = roomList.getRoom(user.currentRoomId);
    //const targetUser = playerList.getPlayer(targetUserId.low);
        console.log(targetUserId);
    //3장 드로우및 핸드수 증가.
    user.addHandCardArr(room.cardDraw(3));
    user.increaseHandCardsCountParam(3);

    const inGameUsers = Array.from(room.getAllPlayers().values());

    const S2CUseCardNotification = {
        cardType: cardType,
        userId: user.id,
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

        const S2CUserUpdateNotification = { user: player.id };

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

    export default lotto;