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
  let success = true;
  let message = 'login success';
  try {
    console.log(email, nickname, password);
    const emailExists = await findUserById(email);
    if (email === "" || nickname === "" || password === "")//입력안했을시 예외처리
    {
      success = false;
      message = "Fill the blank";
      failCode = 7;//등록실패
      console.error("Fill the blank");
    }
    if (emailExists !== null)//id 중복을 검사하는 if문
    {
      success = false;
      message = "This email is already register!";
      failCode = 7;//등록실패
      console.error("This email is already register!");
    }
    const bcryptPassword = await bcrypt.hash(password, Config.SALTROUNDS);//bcrypt로 비밀번호암호화

    await createUser(email, nickname, bcryptPassword);

    const S2CRegisterResponse = {
      success,
      message,
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
