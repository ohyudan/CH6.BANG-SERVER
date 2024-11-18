import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';

const testlogin = async ({ socket, payload }) => {
  let failCode = failCodeReturn(0);

  const S2CLoginResponse = {
    success: true,
    message: '내용',
    token: '1234',
    myInfo: { id: 1, nickname: '2', CharacterData: null },
    GlobalFailCode: failCode,
  };
  const gamePacket = {
    loginResponse: S2CLoginResponse,
  };
  const result = createResponse(
    HANDLER_IDS.LOGIN_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );
  console.log('login 안:');
  console.log(result);
  socket.write(result);
};
export default testlogin;
