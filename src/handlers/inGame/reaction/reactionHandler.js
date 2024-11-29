import playerList from '../../../model/player/playerList.class.js';
import roomList from '../../../model/room/roomList.class.js';
import reactionAction from './reactionIndex.js';
import bigBnangTargetNotification from '../../../utils/notification/state/bigBbangTarget.notification.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import createFailCode from '../../../utils/response/createFailCode.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

const reactionHandler = async ({ socket, payload }) => {
  const { reactionType } = payload;
  const player = playerList.getPlayer(socket.id);
  const state_Type = player.characterData.stateInfo.state;

  // 해당 상태로 판단
  const reactionActionFunction = reactionAction[state_Type].action;

  const { success, failCode } = await reactionActionFunction({ socket, player, reactionType });

  const S2CReactionResponse = {
    success: true, //success,
    failCode: 0, //failCode,
  };
  const gamePacket = {
    reactionResponse: S2CReactionResponse,
  };
  const result = createResponse(
    HANDLER_IDS.REACTION_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );
  socket.write(result);
};

// 리액션
// C2SReactionRequest reactionRequest = 35;
// S2CReactionResponse reactionResponse = 36;

// message C2SReactionRequest {
//     ReactionType reactionType = 1; // NOT_USE_CARD = 1
// }

// message S2CReactionResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }
// enum ReactionType {
//     NONE_REACTION = 0;
//     NOT_USE_CARD = 1;
// }

export default reactionHandler;
