import bigBbang from '../../utils/notification/card/bigBbang.notification.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
const cardTypeAction = {
  [CARD_TYPE.BBANG]: {},
  [CARD_TYPE.BIG_BBANG]: { Action: bigBbangNotification },
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
export default cardTypeAction;
