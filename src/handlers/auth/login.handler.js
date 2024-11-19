import { createResponse } from '../../utils/response/createResponse.js';
import { handler } from '../index.js';
import { handlerError } from '../../error/errorHandler.js';
import Config from '../../config/config.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { createUser, findUserById } from '../../dataBase/user/user.db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; //jwt토큰 발급을 위한 jwt 임포트
import createFailCode from '../../utils/response/createFailCode.js';

//email을 어떻게 할것인지 생각해봐야함
const loginHandler = async ({ socket, payload }) => {
  const { email, password } = payload;
  let failCode = createFailCode(0);
  let success = true;
  let message = 'login success';
  try {
    console.log(email, password);
    const emailExists = await findUserById(email);

    if (emailExists === null) {
      //id 중복을 검사하는 if문
      failCode = 3; //LOGIN_FAIL
      message = 'ID is not exists';
      success = false;
      console.error('ID is not exists');
    }
    if (!(await bcrypt.compare(password, emailExists.password))) {
      //id로찾아낸 db의 정보와 비밀번호 대조
      failCode = 3; //LOGIN_FAIL
      message = 'Password is dismatch.';
      success = false;
      console.error('Password is dismatch.');
    }
    const jwtToken = jwt.sign({ email, password }, 'SECRET_KEY', { expiresIn: '1h' }); //SECRET_KEY부분임시로 채움, 만료시간 1시간으로 설정

    const S2CLoginResponse = {
      success,
      message,
      token: jwtToken,
      myInfo: {
        email,
        nickname: emailExists.nickname,
        character: null,
      },
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
    console.log(result);
    socket.write(result);
  } catch (err) {
    await handlerError(socket, err);
  }
};

export default loginHandler;
