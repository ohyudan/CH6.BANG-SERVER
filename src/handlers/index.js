import HANDLER_IDS from '../constants/handlerIds.js';
import registerHandler from './auth/register.handler.js';
const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: undefined,
    protoType: 'GamePacket',
    protoType: 'C2SRegisterRequest',
  },
};

export const handler = async (socket, packetType, payload) => {
  try {
    const handlerFunction = packetTypes[packetType].packetType;
    if (!handlerFunction) {
      //throw new CustomError();
    }
    await handlerFunction({ socket, payload });
  } catch (err) {
    //await handlerError(socket, err);
  }
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
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 프로토타입을 찾을 수 없습니다.`,
    );
  }

  return handlers[packetType].protoType;
};

export const getProtoPayloadTypeById = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 프로토타입 페이로드를 찾을 수 없습니다.`,
    );
  }

  return handlers[packetType].protoPayloadType;
};
