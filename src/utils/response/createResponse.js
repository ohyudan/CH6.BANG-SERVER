import { PACKET_TYPE_NAMES } from "../../constants/packetTypes.js";
import { getProtoMessages } from "../../init/loadProtos.js"

export const createResponse = (packetType, data) => {
    const protoMessages = getProtoMessages();

    const responseStructure = protoMessages.GamePacket;

    const packetTypeName = PACKET_TYPE_NAMES[packetType];

    const responsePayload = {};
    responsePayload[packetTypeName] = data;

    const payloadBuffer = responseStructure.encode(responsePayload).finish();

    const headerBuffer = createHeader(packetType, payloadBuffer, 1);

    return Buffer.concat([headerBuffer, payloadBuffer]);
}