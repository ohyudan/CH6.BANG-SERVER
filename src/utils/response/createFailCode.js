import { getProtoMessages } from '../../init/loadProtos.js';
/**
 * failCode를 반환해주는 함수
 * @param {*} number
 * @returns {number}
 */
export const createFailCode = (number) => {
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
      result = failCode.values.CREATE_ROOM_FAILED; // 방 생성 실패
      break;
    case 5:
      result = failCode.values.JOIN_ROOM_FAILED; // 방 입장 실패
      break;
    case 6:
      result = failCode.values.LEAVE_ROOM_FAILED; // 방 나가기 실패
      break;
    case 7:
      result = failCode.values.REGISTER_FAILED; // 등록 실패
      break;
    case 8:
      result = failCode.values.ROOM_NOT_FOUND; // 방을 찾을 수 없음
      break;
    case 9:
      result = failCode.values.CHARACTER_NOT_FOUND; // 캐릭터를 찾을 수 없음
      break;
    case 10:
      result = failCode.values.CHARACTER_STATE_ERROR; // 캐릭터 상태 오류
      break;
    case 11:
      result = failCode.values.CHARACTER_NO_CARD; // 캐릭터에 카드 없음
      break;
    case 12:
      result = failCode.values.INVALID_ROOM_STATE; // 잘못된 방 상태
      break;
    case 13:
      result = failCode.values.NOT_ROOM_OWNER; // 방 소유자가 아님
      break;
    case 14:
      result = failCode.values.ALREADY_USED_BBANG; // 이미 사용된 빵야 카드?
      break;
    case 15:
      result = failCode.values.INVALID_PHASE; // 잘못된 페이즈
      break;
    case 16:
      result = failCode.values.CHARACTER_CONTAINED; // 캐릭터가 포함됨
      break;
  }
  return result;
};
export default createFailCode;
