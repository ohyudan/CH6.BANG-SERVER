import { bigBbangNotification } from '../../utils/notification/card/bigBbang.notification.js';
import shieldNotification from '../../utils/notification/card/shield.notification.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import bbang from '../../utils/card/bbang.js';
import weapon from '../../utils/card/weapon.js';
import equip from '../../utils/card/equip.js';

const cardTypeAction = {
  [CARD_TYPE.BBANG]: { Action: bbang },
  [CARD_TYPE.BIG_BBANG]: { Action: bigBbangNotification },
  [CARD_TYPE.SHIELD]: { action: shieldNotification },
  [CARD_TYPE.VACCINE]: {},
  [CARD_TYPE.CALL_119]: {},
  [CARD_TYPE.DEATH_MATCH]: {},
  [CARD_TYPE.GUERRILLA]: {},
  [CARD_TYPE.ABSORB]: {},
  [CARD_TYPE.HALLUCINATION]: {},
  [CARD_TYPE.FLEA_MARKET]: {},
  [CARD_TYPE.MATURED_SAVINGS]: {},
  [CARD_TYPE.WIN_LOTTERY]: { action: lotto },
  [CARD_TYPE.SNIPER_GUN]: { action: weapon },
  [CARD_TYPE.HAND_GUN]: { action: weapon },
  [CARD_TYPE.DESERT_EAGLE]: { action: weapon },
  [CARD_TYPE.AUTO_RIFLE]: { action: weapon },
  [CARD_TYPE.LASER_POINTER]: { action: equip },
  [CARD_TYPE.RADAR]: { action: equip },
  [CARD_TYPE.AUTO_SHIELD]: { action: equip },
  [CARD_TYPE.STEALTH_SUIT]: { action: equip },
  [CARD_TYPE.CONTAINMENT_UNIT]: {},
  [CARD_TYPE.SATELLITE_TARGET]: {},
  [CARD_TYPE.BOMB]: {},
};
export default cardTypeAction;
