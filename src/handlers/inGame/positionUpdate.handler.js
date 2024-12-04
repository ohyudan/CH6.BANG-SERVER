import HANDLER_IDS from '../../constants/handlerIds.js';
import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';
import { createResponse } from '../../utils/response/createResponse.js';

const positionUpdateHandler = ({ socket, payload }) => {
  const { x, y } = payload;

  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);

  user.updatePosition(x, y);

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

  return;
};

export default positionUpdateHandler;
