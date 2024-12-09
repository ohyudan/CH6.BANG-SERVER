import HANDLER_IDS from '../../../constants/handlerIds.js';
import { createResponse } from '../../response/createResponse.js';

const positionUpdateNotification = (room) => {
  const inGameUsers = Array.from(room.getAllPlayers().values());

  const inGamePlayersPositions = inGameUsers.map((player) => ({
    id: player.id,
    x: player.position.x,
    y: player.position.y,
  }));

  // 같은 룸에 있는 플레이어들에게 알림
  inGameUsers.forEach((player) => {
    const S2CPositionUpdateNotification = {
      characterPositions: inGamePlayersPositions,
    };

    const gamePacket = { positionUpdateNotification: S2CPositionUpdateNotification };

    const positionUpdateNotification = createResponse(
      HANDLER_IDS.POSITION_UPDATE_NOTIFICATION,
      player.socket.version,
      player.socket.sequence,
      gamePacket,
    );

    player.socket.write(positionUpdateNotification);
  });
};

export default positionUpdateNotification;
