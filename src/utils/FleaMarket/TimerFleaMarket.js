import { CHARACTER_STATE_TYPE } from '../../constants/user.enum.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse } from '../response/createResponse.js';
import fleaMaketHanlder from '../../handlers/inGame/fleamarketHandler.js';

const TimerFleaMarket = (player, roomJoinPlayer, count) => {
  const timerId = setInterval(() => {
    if (
      count >= 0 &&
      player.characterData.stateInfo.state == CHARACTER_STATE_TYPE.FLEA_MARKET_TURN
    ) {
      const userMakeData = [];

      roomJoinPlayer.forEach((values) => {
        if (values.id == player.id) {
          values.setNextStateAt(Date.now() + count * 1000);
        }
        userMakeData.push(values.makeRawObject());
      });

      roomJoinPlayer.forEach((values) => {
        const S2CUserUpdateNotification = {
          user: userMakeData,
        };
        const gamePacket = { userUpdateNotification: S2CUserUpdateNotification };
        const result = createResponse(
          HANDLER_IDS.USER_UPDATE_NOTIFICATION,
          values.socket.version,
          values.socket.sequence,
          gamePacket,
        );
        values.socket.write(result);
      });
      count--;
    } else {
      clearInterval(timerId);
      // 강제 선택이 가능하나? 리스폰 그냥 날려도 되나
      console.log('카운트다운 종료');
    }
  }, 1000);
};

export default TimerFleaMarket;
