import HANDLER_IDS from '../../constants/handlerIds.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import { createResponse } from '../../utils/response/createResponse.js';

const positionUpdateHandler = ({ socket, payload }) => {
  const { x, y } = payload;

  const player = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(player.currentRoomId);

  player.updatePosition(x, y);

  const inGamePlayersPositions = playerList.forEach((player) => { // 같은 룸 플레이어들의 위치 정보
    if (player.currentRoomId === room.id) {
        return player.position;
    }
  })

  console.log(inGamePlayersPositions);

  // 같은 룸에 있는 플레이어들에게 알림
  playerList.forEach((player) => {
    if (player.currentRoomId === room.id) {
        const S2CPositionUpdateNotification = { 
            characterPosition: inGamePlayersPositions,
        }

        const gamePacket = { positionUpdateNotification: S2CPositionUpdateNotification };

        const positionUpdateNotification = createResponse(
          HANDLER_IDS.POSITION_UPDATE_NOTIFICATION,
          player.socket.version,
          player.socket.sequence,
          gamePacket,
        );
    
        player.socket.write(positionUpdateNotification);
    }
  })

  return;
};

export default positionUpdateHandler;