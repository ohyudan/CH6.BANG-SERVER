import bigBbang from '../../utils/card/bigBbang.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import equip from '../../utils/card/equip.js';
const cardTypeAction = {
  [CARD_TYPE.BBANG]: {},
  [CARD_TYPE.BIG_BBANG]: { Action: bigBbang },
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
  [CARD_TYPE.LASER_POINTER]: { Action: equip },
  [CARD_TYPE.RADAR]: { Action: equip },
  [CARD_TYPE.AUTO_SHIELD]: { Action: equip },
  [CARD_TYPE.STEALTH_SUIT]: { Action: equip },
  [CARD_TYPE.CONTAINMENT_UNIT]: {},
  [CARD_TYPE.SATELLITE_TARGET]: {},
  [CARD_TYPE.BOMB]: {},
};
export default cardTypeAction;
