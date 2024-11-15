import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
import { handler } from '../index.js';
import { handlerError } from '../../error/errorHandler.js';
import Config from '../../config/config.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { createUser, findUserById } from '../../dataBase/user/user.db.js';
import bcrypt from 'bcrypt';

//email을 어떻게 할것인지 생각해봐야함
const registerHandler = async ({ socket, payload }) => {
  const { id, password, passwordConfirm } = payload;
  let failCode = failCodeReturn(0);
  try {
    console.log(id, password, passwordConfirm);
    const idExists=await findUserById(id);
    if(idExists!==null)//id 중복을 검사하는 if문
    {
      failCode = 7;
      const S2CRegisterResponse = {
        success: 'fail',
        message: 'ID already exists',
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
      return socket.write(result);
    }
    const bcryptPassword=await bcrypt.hash(password,SALTROUNDS);//bcrypt로 비밀번호암호화


    await createUser(id,bcryptPassword);
    
    const S2CRegisterResponse = {
      success: 'success',
      message: 'register success',
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
    console.log(result);
    socket.write(result);
  } catch (err) {
    await handlerError(socket, err);
  }
};

export default registerHandler;
