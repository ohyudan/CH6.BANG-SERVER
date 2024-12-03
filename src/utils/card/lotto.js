    import { CARD_TYPE } from '../../constants/card.enum.js';
    import HANDLER_IDS from '../../constants/handlerIds.js';
    import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
    import playerList from '../../model/player/playerList.class.js';
    import roomList from '../../model/room/roomList.class.js';
    import createFailCode from '../../utils/response/createFailCode.js';
    import { createResponse } from '../../utils/response/createResponse.js';

    //타겟이 로또npc  targetUserId 필요없는것 같기도.
    const lotto = ({ socket, cardType }) => {

    const user = playerList.getPlayer(socket.id);
    const room = roomList.getRoom(user.currentRoomId);
    //const targetUser = playerList.getPlayer(targetUserId.low);
    //3장 드로우및 핸드수 증가.
    const card=room.cardDraw(3);
    for(let i=0;i<3;i++)
    {
        user.addHandCard(card[i]);
        user.increaseHandCardsCount();
    }
    
    //핸드에서 해당 카드 제거
    user.removeHandCard(CARD_TYPE.WIN_LOTTERY);
    user.characterData.handCardsCount--;


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

    return {
        success: true,
        failCode: createFailCode(0),
    };
    };

    export default lotto;