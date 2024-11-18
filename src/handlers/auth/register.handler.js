import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
import { handler } from '../index.js';
import { handlerError } from '../../error/errorHandler.js';
import Config from '../../config/config.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
const registerHandler = async ({ socket, payload }) => {
  const { id, password, email } = payload;
  let failCode = failCodeReturn(0);
  try {
    //console.log(id, password, email);
    const S2CRegisterResponse = {
      success: '결과',
      message: '내용',
      GlobalFailCode: failCode,
    };
    const gamePacket = {
      registerResponse: S2CRegisterResponse,
    };
    const result = createResponse(
      HANDLER_IDS.REGISTER_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    socket.write(result);
  } catch (err) {
    await handlerError(socket, err);
  }
};

export default registerHandler;
