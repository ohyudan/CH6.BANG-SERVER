import createFailCode from './createFailCode.js';
import { createResponse } from './createResponse.js';
import roomList from '../../model/room/roomList.class.js';
import playerList from '../../model/player/playerList.class.js';
import HANDLER_IDS from '../../constants/handlerIds.js';

const animation = (socket, player, Type) => {
  const S2CAnimationNotification = {
    userId: player.id,
    animationType: Type,
  };
  const gamePacket = { animationNotification: S2CAnimationNotification };
  const result = createResponse(
    HANDLER_IDS.ANIMATION_NOTIFICATION,
    socket.version,
    socket.sequence,
    gamePacket,
  );
  return result;
};
export default animation;
// const ANIMATION_TYPE = {
//     NO_ANIMATION: 0,
//     SATELLITE_TARGET_ANIMATION: 1,
//     BOMB_ANIMATION: 2,
//     SHIELD_ANIMATION: 3,
//   };

// message S2CAnimationNotification {
//     int64 userId = 1;
//     AnimationType animationType = 2;
// }
