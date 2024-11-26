import HANDLER_IDS from '../constants/handlerIds.js';
import { PACKET_TYPE_NAMES } from '../constants/packetTypes.js';
import { CustomError } from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import loginHandler from './auth/login.handler.js';
import registerHandler from './auth/register.handler.js';
import roomListGetHandler from './room/roomListGetHandler.js';
import roomCreateHander from './room/roomCreateHandler.js';
import roomJoinHandler from './room/roomJoinHandler.js';
import roomLeaveHandler from './room/roomLeaveHandler.js';
import roomJoinRamdomHandler from './room/roomJoinRamdomHandler.js';
import gamePrepareHandler from './game/gamePrepare.handler.js';
import gameStartHandler from './game/gameStart.handler.js';
import positionUpdateHandler from './game/positionUpdate.handler.js';
import useCardHandler from './cards/useCard.handler.js';

const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: registerHandler,
    protoType: 'C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    packetType: loginHandler,
    protoType: 'C2SLoginRequest',
  },
  [HANDLER_IDS.GAME_PREPARE_REQUEST]: {
    packetType: gamePrepareHandler,
    protoType: 'C2SGamePrepareRequest',
  },
  [HANDLER_IDS.GAME_START_REQUEST]: {
    packetType: gameStartHandler,
    protoType: 'C2SGameStartRequest',
  },
  [HANDLER_IDS.GET_ROOM_LIST_REQUEST]: {
    packetType: roomListGetHandler,
    protoType: 'C2SGetRoomListRequest',
  },
  [HANDLER_IDS.CREATE_ROOM_REQUEST]: {
    packetType: roomCreateHander,
    protoType: 'C2SCreateRoomRequest',
  },
  [HANDLER_IDS.JOIN_ROOM_REQUEST]: {
    packetType: roomJoinHandler,
    protoType: 'C2SJoinRoomRequest',
  },
  [HANDLER_IDS.LEAVE_ROOM_REQUEST]: {
    packetType: roomLeaveHandler,
    protoType: 'C2SLeaveRoomRequest',
  },
  [HANDLER_IDS.JOIN_RANDOM_ROOM_REQUEST]: {
    packetType: roomJoinRamdomHandler,
    ptoroType: 'C2SJoinRandomRoomRequest',
  },
  [HANDLER_IDS.POSITION_UPDATE_REQUEST]: {
    packetType: positionUpdateHandler,
    protoType: 'C2SPositionUpdateRequest',
  },
  [HANDLER_IDS.USE_CARD_REQUEST]: {
    packetType: useCardHandler,
    protoType: 'C2SUseCardRequest',
  }
};
/**
 * 패킷타입에 맞는 핸들러로 분배해주는 함수
 * @param {Socket} socket
 * @param {Number} packetType
 * @param {Object} payload
 */
export const handler = async (socket, packetType, payload) => {
  try {
    const handlerFunction = packetTypes[packetType].packetType;
    if (!handlerFunction) {
      throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러를 찾을 수 없습니다`);
    }
    await handlerFunction({ socket, payload });
  } catch (err) {
    //await handlerError(socket, err);
  }
};
