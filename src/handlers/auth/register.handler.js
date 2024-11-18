import Joi from 'joi';
import bcrypt from 'bcrypt';
import HANDLER_IDS from '../../constants/handlerIds.js';
import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
import { CreateUser, findUserByEmail, findUserByNickname } from '../../dataBase/user/user.db.js';

const failResponse = (num) => {

let message = 'Failed';
switch(num) {
  case 1:
    message = '입력받은 값이 유효하지 않습니다.'
    console.log(message);
    break;
  case 2:
    message = '이메일이 이미 존재합니다.'
    console.log(message);
    break;
  case 3:
    message = '닉네임이 이미 존재합니다.'
    console.log(message);
    break;
  default:
    break;
}

const S2CRegisterResponse = {
  success: false,
  message: message,
  GlobalFailCode: 2,
};
console.log(S2CRegisterResponse);

const gamePacket = { registerResponse: S2CRegisterResponse };

const registerFailResponse = createResponse(
  HANDLER_IDS.REGISTER_RESPONSE,
  socket.version,
  socket.sequence,
  gamePacket,
);

console.log(registerFailResponse);
socket.write(registerFailResponse);
return;
}


const registerHandler = async ({ socket, payload }) => {
  // const { id, password, email } = payload;
  const { email, nickname, password } = payload;
  console.log(payload);
  let failCode = 0;

  const testUserInfo = {
    email: email,
    nickname: nickname,
    password: password,
  };

  const joinSchema = Joi.object({
    email: Joi.string().alphanum().lowercase().required(),
    nickname: Joi.string().min(2).max(8).required(),
    password: Joi.string().min(4).required(),
  });

  const validateResult = joinSchema.validate(testUserInfo);
  if (validateResult.error) {
    failResponse(1);
  }
  
  const user = await findUserByEmail(email);
  if (user) {
    failResponse(2);
  }

  const dbNickname = await findUserByNickname(nickname);
  if (dbNickname) {
    failResponse(3);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await CreateUser(email, nickname, hashedPassword);

  failCode = 0;

  const S2CRegisterResponse = {
    success: true,
    message: 'Success',
    GlobalFailCode: 0,
  };

  const gamePacket = { registerResponse: S2CRegisterResponse };

  const registerResponse = createResponse(
    HANDLER_IDS.REGISTER_RESPONSE,
    socket.version,
    socket.sequence,
    gamePacket,
  );

  console.log('회원가입에 성공했습니다.');
  socket.write(registerResponse);
  return;

  // if (validateResult.error) {
  //   const registerFailResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
  //     success: false,
  //     message: 'Failed',
  //     failcode: '2',
  //   });

  //   console.log('fail: wrong value');
  //   socket.write(registerFailResponse);
  //   return;
  // }
};

// =======
// import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
// import { handler } from '../index.js';
// import { handlerError } from '../../error/errorHandler.js';
// import Config from '../../config/config.js';
// import HANDLER_IDS from '../../constants/handlerIds.js';
// const registerHandler = async ({ socket, payload }) => {
//   const { id, password, email } = payload;
//   let failCode = failCodeReturn(0);
//   try {
//     console.log(id, password, email);
//     const S2CRegisterResponse = {
//       success: '결과',
//       message: '내용',
//       GlobalFailCode: failCode,
//     };
//     const gamePacket = {
//       registerResponse: S2CRegisterResponse,
//     };
//     const result = createResponse(
//       HANDLER_IDS.REGISTER_RESPONSE,
//       socket.version,
//       socket.sequence,
//       gamePacket,
//     );
//     console.log(result);
//     socket.write(result);
//   } catch (err) {
//     await handlerError(socket, err);
//   }
// };

// >>>>>>> JoinRandomRoom
export default registerHandler;
