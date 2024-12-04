import bigBbangNotification from '../../utils/notification/card/bigBbang.notification.js';
import shieldNotification from '../../utils/notification/card/shield.notification.js';
import { CARD_TYPE } from '../../constants/card.enum.js';
import bbang from '../../utils/card/bbang.js';
import weapon from '../../utils/card/weapon.js';
import equip from '../../utils/card/equip.js';
import vaccineNotification from '../../utils/notification/card/vaccine.notification.js';
import call119Notification from '../../utils/notification/card/call119.notification.js';
import lotto from '../../utils/card/lotto.js';
import guerrillaNotification from '../../utils/notification/card/guerrilla.notification.js';
import deathMatchNotification from '../../utils/notification/card/deathMatch.notification.js';
import absorbNotification from '../../utils/notification/card/absorb.notification.js';
import maturitySaving from '../../utils/card/maturitySaving.js';
import hallucination from '../../utils/card/hallucination.js';

const cardTypeAction = {
  [CARD_TYPE.BBANG]: { action: bbang },
  [CARD_TYPE.BIG_BBANG]: { Action: bigBbangNotification },
  [CARD_TYPE.SHIELD]: {},
  [CARD_TYPE.VACCINE]: { Action: vaccineNotification },
  [CARD_TYPE.CALL_119]: { Action: call119Notification },
  [CARD_TYPE.BIG_BBANG]: { action: bigBbangNotification },
  [CARD_TYPE.SHIELD]: { action: shieldNotification },
  [CARD_TYPE.VACCINE]: { action: vaccineNotification },
  [CARD_TYPE.CALL_119]: { action: call119Notification },
  [CARD_TYPE.DEATH_MATCH]: { action: deathMatchNotification },
  [CARD_TYPE.GUERRILLA]: { action: guerrillaNotification },
  [CARD_TYPE.ABSORB]: { action: absorbNotification },
  [CARD_TYPE.HALLUCINATION]: {action: hallucination},
  [CARD_TYPE.FLEA_MARKET]: {},
  [CARD_TYPE.MATURED_SAVINGS]: {action: maturitySaving},
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
