import HANDLER_IDS from '../../constants/handlerIds.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import { createResponse } from '../../utils/response/createResponse.js';
const useCardHandler = ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;

  const cardTypeAction = {
    [CARD_TYPE.BBANG]: {},
    [CARD_TYPE.BIG_BBANG]: { handler: undefined },
    [CARD_TYPE.SHIELD]: {},
    [CARD_TYPE.VACCINE]: {},
    [CARD_TYPE.CALL_119]: {},
    [CARD_TYPE.DEATH_MATCH]: {},
    [CARD_TYPE.GUERRILLA]: {},
    [CARD_TYPE.ABSORB]: {},
    [CARD_TYPE.HALLUCINATION]: {},
    [CARD_TYPE.FLEA_MARKET]: {},
    [CARD_TYPE.MATURED_SAVINGS]: {},
    [CARD_TYPE.WIN_LOTTERY]: {},
    [CARD_TYPE.SNIPER_GUN]: {},
    [CARD_TYPE.HAND_GUN]: {},
    [CARD_TYPE.DESERT_EAGLE]: {},
    [CARD_TYPE.AUTO_RIFLE]: {},
    [CARD_TYPE.LASER_POINTER]: {},
    [CARD_TYPE.RADAR]: {},
    [CARD_TYPE.AUTO_SHIELD]: {},
    [CARD_TYPE.STEALTH_SUIT]: {},
    [CARD_TYPE.CONTAINMENT_UNIT]: {},
    [CARD_TYPE.SATELLITE_TARGET]: {},
    [CARD_TYPE.BOMB]: {},
  };
};

export default useCardHandler;
// message C2SUseCardRequest {
//     CardType cardType = 1;
//     int64 targetUserId = 2; // 타겟 없으면 빈 값
// }

// message S2CUseCardResponse { // 성공 여부만 반환하고 대상 유저 효과는 S2CUserUpdateNotification로 통지
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }

// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 0
// }message S2CEquipCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
// }

// message S2CCardEffectNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     bool success = 3;
// }
