import { CustomError } from '../../error/customError.js';
import { ErrorCodes } from '../../error/errorCodes.js';
import { getProtoPayloadTypeById, getProtoTypeById } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (payloadData, packetType) => {
  const protoMessages = getProtoMessages();

  const protoTypeName = getProtoTypeById(packetType);
  // 현재 패킷타입이 들어있는 GamePacket 프로토타입을 가져옴

  if (!protoTypeName) {
    throw new Error(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] 핸들러의 프로토타입을 찾을 수 없습니다. : ${err.message}`,
    );
  }

  const payloadTypeStructure = protoMessages[protoTypeName];
  // load한 protoMessages 중 GamePacket에 맞는 message 구조를 가져옴

  const payloadTypeName = getProtoPayloadTypeById(packetType);
  // message 구조의 oneof payload를 payloadType에 해당하는 message를 가져옴
  // 예시) GamePacket의 loginRequest

  let payload;

  try {
    payload = payloadTypeStructure.decode(payloadData)[payloadTypeName];
    // packetType에 해당하는 message 구조에서 payloadDate를 decode한다.
  } catch (err) {
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      `페이로드 디코딩 중 오류가 발생: ${err.message}`,
    );
  }

  const errorMeesage = payloadTypeStructure.verify(payload);
  if (errorMeesage) {
    throw new CustomError(
      ErrorCodes.PACKET_STRUCTURE_MISMATCH,
      `페이로드 구조가 타입과 일치하지 않습니다. : ${err.message}`,
    );
  }

  return { payload };
};
