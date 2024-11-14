import HANDLER_IDS from '../constants/handlerIds.js';


const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    handler: registerHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.REGISTER],
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
