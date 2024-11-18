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
      result = failCode.values.NONE_FAILCODE;
      break;
    case 1:
      result = failCode.values.UNKNOWN_ERROR;
      break;
    case 2:
      result = failCode.values.INVALID_REQUEST;
      break;
    case 3:
      result = failCode.values.AUTHENTICATION_FAILED;
      break;
    case 4:
      result = failCode.CREATE_ROOM_FAILED; // 방 생성 실패
      break;
    case 5:
      result = failCode.JOIN_ROOM_FAILED; // 방 입장 실패
      break;
    case 6:
      result = failCode.LEAVE_ROOM_FAILED; // 방 나가기 실패
      break;
    case 7:
      result = failCode.REGISTER_FAILED; // 등록 실패
      break;
    case 8:
      result = failCode.ROOM_NOT_FOUND; // 방을 찾을 수 없음
      break;
    case 9:
      result = failCode.CHARACTER_NOT_FOUND; // 캐릭터를 찾을 수 없음
      break;
    case 10:
      result = failCode.CHARACTER_STATE_ERROR; // 캐릭터 상태 오류
      break;
    case 11:
      result = failCode.CHARACTER_NO_CARD; // 캐릭터에 카드 없음
      break;
    case 12:
      result = failCode.INVALID_ROOM_STATE; // 잘못된 방 상태
      break;
    case 13:
      result = failCode.NOT_ROOM_OWNER; // 방 소유자가 아님
      break;
    case 14:
      result = failCode.ALREADY_USED_BBANG; // 이미 사용된 빵야 카드?
      break;
    case 15:
      result = failCode.INVALID_PHASE; // 잘못된 페이즈
      break;
    case 16:
      result = failCode.CHARACTER_CONTAINED; // 캐릭터가 포함됨
      break;
  }
  return result;
};
