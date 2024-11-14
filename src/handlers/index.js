import HANDLER_IDS from '../constants/handlerIds.js';
import { PACKET_TYPE_NAMES } from '../constants/packetTypes.js';
import { CustomError } from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import registerHandler from './auth/register.handler.js';

const handlers = {
  [HANDLER_IDS.REGISTER]: {
    handler: registerHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.REGISTER],
  },
};

export const getHandlerById = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 핸들러를 찾을 수 없습니다.`,
    );
  }

  return handlers[packetType].handler;
};

export const getProtoTypeById = (packetType) => {
  if (!handlers[packetType]){
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 프로토타입을 찾을 수 없습니다.`,
    )
  }

  return handlers[packetType].protoType;
}

export const getProtoPayloadTypeById = (packetType) => {
    if (!handlers[packetType]) {
        throw new CustomError(
            ErrorCodes.UNKNOWN_HANDLER_ID,
            `[${packetType}] HandlerID의 프로토타입 페이로드를 찾을 수 없습니다.`
        )
    }

    return handlers[packetType].protoPayloadType;
}