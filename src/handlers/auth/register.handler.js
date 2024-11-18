import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
import { handler } from '../index.js';
import { handlerError } from '../../error/errorHandler.js';
import Config from '../../config/config.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { createUser, findUserById } from '../../dataBase/user/user.db.js';
import bcrypt from 'bcrypt';


const registerHandler = async ({ socket, payload }) => {
  const { email, nickname, password } = payload;
  let failCode = failCodeReturn(0);
  try {
    console.log(email, nickname, password);
    const emailExists=await findUserById(email);
    if(email===""||nickname===""||password==="")//입력안했을시 예외처리
    {
      console.error("Fill the blank");
      return { success: false };
    }
    if(emailExists!==null)//id 중복을 검사하는 if문
    {
      // failCode = 7;
      // const S2CRegisterResponse = {
      //   success: 'fail',
      //   message: 'ID already exists',
      //   GlobalFailCode: failCode,
      // };
      // const gamePacket = {
      //   registerResponse: S2CRegisterResponse,
      // };
      // const result = createResponse(
      //   HANDLER_IDS.REGISTER_RESPONSE,
      //   socket.version,
      //   socket.sequence,
      //   gamePacket,
      // );
      console.error("This email is already register!");
      return { success: false };
    }
    const bcryptPassword=await bcrypt.hash(password,Config.SALTROUNDS);//bcrypt로 비밀번호암호화


    await createUser(email, nickname, bcryptPassword);
    
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
