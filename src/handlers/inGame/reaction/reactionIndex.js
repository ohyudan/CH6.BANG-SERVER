import { CHARACTER_STATE_TYPE } from '../../../constants/user.enum.js';
import bigBnangTargetNotification from '../../../utils/notification/state/bigBnangTarget.notification.js';
const reactionAction = {
  [CHARACTER_STATE_TYPE.BIG_BBANG_TARGET]: {
    action: bigBnangTargetNotification,
  },
  [CHARACTER_STATE_TYPE.BBANG_SHOOTER]: {},
};

export default reactionAction;
