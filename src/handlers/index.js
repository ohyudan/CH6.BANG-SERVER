import HANDLER_IDS from '../constants/handlerIds.js';
import { PACKET_TYPE_NAMES } from '../constants/packetTypes.js';
import { CustomError } from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import registerHandler from './auth/register.handler.js';
const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: registerHandler,
    protoType: 'C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SLoginRequest',
  },
  [HANDLER_IDS.GET_ROOM_LIST_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SGetRoomListRequest',
  },
  [HANDLER_IDS.CREATE_ROOM_REQUEST]: {
    packetType: undefined,
    protoType: 'C2SCreateRoomRequest',
  },
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

// export const getHandlerById = (packetType) => {
//   if (!handlers[packetType]) {
//     throw new CustomError(
//       ErrorCodes.UNKNOWN_HANDLER_ID,
//       `[${packetType}] HandlerID의 핸들러를 찾을 수 없습니다.`,
//     );
//   }

//   return handlers[packetType].handler;
// };

// export const getProtoTypeById = (packetType) => {
//   if (!handlers[packetType]) {
//     throw new CustomError(
//       ErrorCodes.UNKNOWN_HANDLER_ID,
//       `[${packetType}] HandlerID의 프로토타입을 찾을 수 없습니다.`,
//     );
//   }

//   return handlers[packetType].protoType;
// };

// export const getProtoPayloadTypeById = (packetType) => {
//   if (!handlers[packetType]) {
//     throw new CustomError(
//       ErrorCodes.UNKNOWN_HANDLER_ID,
//       `[${packetType}] HandlerID의 프로토타입 페이로드를 찾을 수 없습니다.`,
//     );
//   }

//   return handlers[packetType].protoPayloadType;
// };
