import bigBbangNotification from '../../utils/notification/card/bigBbang.notification.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import equip from '../../utils/card/equip.js';
import weapon from '../../utils/card/weapon.js';
import vaccineNotification from '../../utils/notification/card/vaccine.notification.js';
import call119Notification from '../../utils/notification/card/call119.notification.js';

const cardTypeAction = {
  [CARD_TYPE.BBANG]: {},
  [CARD_TYPE.BIG_BBANG]: { Action: bigBbangNotification },
  [CARD_TYPE.SHIELD]: {},
  [CARD_TYPE.VACCINE]: { Action: vaccineNotification },
  [CARD_TYPE.CALL_119]: { Action: call119Notification },
  [CARD_TYPE.DEATH_MATCH]: {},
  [CARD_TYPE.GUERRILLA]: {},
  [CARD_TYPE.ABSORB]: {},
  [CARD_TYPE.HALLUCINATION]: {},
  [CARD_TYPE.FLEA_MARKET]: {},
  [CARD_TYPE.MATURED_SAVINGS]: {},
  [CARD_TYPE.WIN_LOTTERY]: {},
  [CARD_TYPE.SNIPER_GUN]: { Action: weapon },
  [CARD_TYPE.HAND_GUN]: { Action: weapon },
  [CARD_TYPE.DESERT_EAGLE]: { Action: weapon },
  [CARD_TYPE.AUTO_RIFLE]: { Action: weapon },
  [CARD_TYPE.LASER_POINTER]: { Action: equip },
  [CARD_TYPE.RADAR]: { Action: equip },
  [CARD_TYPE.AUTO_SHIELD]: { Action: equip },
  [CARD_TYPE.STEALTH_SUIT]: { Action: equip },
  [CARD_TYPE.CONTAINMENT_UNIT]: {},
  [CARD_TYPE.SATELLITE_TARGET]: {},
  [CARD_TYPE.BOMB]: {},
};
export default cardTypeAction;
