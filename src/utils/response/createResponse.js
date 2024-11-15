import { getProtoMessages } from '../../init/loadProtos.js';
import { serialize } from '../Packet/serialize.js';

/**
 * 응답 패킷을 생성하는 함수
 * @param {number} packetType - Config.PackType 참조
 * @param {number} sequence - 패킷 순서
 * @param {GamePacket} gamePacket - 객체{ 객체:{ 데이터 ...}}
 * @returns {Buffer}
 */
export const createResponse = (packetType, version, sequence, gamePacket) => {
  const protoMessages = getProtoMessages();

  const Response = protoMessages.packets.GamePacket;

  const payload = Response.encode(gamePacket).finish();

  const result_Buffer = serialize(packetType, version, sequence, payload);

  return result_Buffer;
};

/**
 * failCode를 반환해주는 함수
 * @param {*} number
 * @returns {number}
 */
export const failCodeReturn = (number) => {
  const protoMessages = getProtoMessages();
  const failCode = protoMessages.failCode.GlobalFailCode;
  let result;
  switch (number) {
    case 0:
      result = failCode.NONE;
      break;
    case 1:
      result = failCode.UNKNOWN_ERROR;
      break;
    case 2:
      result = failCode.INVALID_REQUEST;
      break;
    case 3:
      result = failCode.AUTHENTICATION_FAILED;
      break;
  }
  return result;
};
