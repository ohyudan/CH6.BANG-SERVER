import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import bigBnangTargetNotification from '../../../utils/notification/state/bigBbangTarget.notification.js';
import bigBnangShooterNotification from '../../../utils/notification/state/bigBbangShooter.notification.js';
import bbangTargetNotification from '../../../utils/notification/state/bbangTarget.notification.js';
import guerrillaTargetNotification from '../../../utils/notification/state/guerrillaTarget.notification.js';
import deathMatchReactionNotification from '../../../utils/notification/card/deathMatchReaction.notification.js';
const reactionAction = {
  [CHARACTER_STATE_TYPE.BIG_BBANG_TARGET]: {
    action: bigBnangTargetNotification,
  },
  [CHARACTER_STATE_TYPE.BBANG_TARGET]: {
    action: bbangTargetNotification,
  },
  [CHARACTER_STATE_TYPE.GUERRILLA_TARGET]: {
    action: guerrillaTargetNotification,
  },
  // [CHARACTER_STATE_TYPE.BBANG_SHOOTER]: {
  //   action: bigBnangShooterNotification,
  // },
  [CHARACTER_STATE_TYPE.DEATH_MATCH_TURN_STATE]: {
    action: deathMatchReactionNotification,
  }
};

export default reactionAction;
