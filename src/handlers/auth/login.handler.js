import { v4 as uuidv4 } from 'uuid';
import Config from '../../config/config.js';
import { findUserByEmail } from '../../dataBase/user/user.db.js';
import { addLobby, findUnfilledLobby, getLobbySessions } from '../../session/lobby.session.js';
import { addUser, getUserById } from '../../session/user.session.js';
import { createResponse, failCodeReturn } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import HANDLER_IDS from '../../constants/handlerIds.js';



const loginHandler = async ({ socket, payload }) => {
  const { email, password } = payload;

  const loginUser = await findUserByEmail(email);
  let failCode = 0;
  // db에 정보가 없으면
  if (!loginUser) {
    failCode = failCodeReturn(2);

    const S2CLoginResponse = {
      success: false,
      message: 'Failed',
      token: '',
      myInfo: {},
      GlobalFailCode: 2,
    };

    const gamePacket = { loginResponse: S2CLoginResponse };
    const loginFailResponse = createResponse(
      HANDLER_IDS.LOGIN_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    console.log('계정이 존재하지 않습니다.');
    socket.write(loginFailResponse);
    return;
  } else {
    const passwordValidate = await bcrypt.compare(password, loginUser.password);

    if (!passwordValidate) {
      failCode = failCodeReturn(2);

      const S2CLoginResponse = {
        success: false,
        message: 'Failed',
        token: '',
        myInfo: {},
        GlobalFailCode: 2,
      };

      const gamePacket = { loginResponse: S2CLoginResponse };

      const loginFailResponse = createResponse(
        HANDLER_IDS.LOGIN_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );

      console.log('비밀번호가 일치하지 않습니다.');
      socket.write(loginFailResponse);
      return;
    } else {
      // 유저 세션에 로그인한 유저가 없다면 유저 세션에 추가
      if (!getUserById(loginUser.id)) {
        const token = JWT.sign(
          {
            id: loginUser.id,
          },
          Config.AUTH.SECRET_KEY,
          { expiresIn: '1h' },
        );

        // 유저 세션에 추가
        addUser(socket, loginUser.id, loginUser.email);
        const user = getUserById(loginUser.id);

        // 자리가 남아있는 로비를 검색
        let unfilledLobby = findUnfilledLobby();

        // 자리가 남은 로비가 없다면 생성
        if (!unfilledLobby) {
          addLobby();
          console.log(getLobbySessions());
          unfilledLobby = findUnfilledLobby();
        }

        // 유저를 자리가 남은 로비에 입장시키기
        unfilledLobby.addUser({
          id: user.id,
          nickname: user.nickname,
          character: user.character,
        });
        // 로비에 유저를 입장시키고 로비 상태 확인
        unfilledLobby.stateCheck();

        // 로비에 입장되었는지 확인용
        console.log(getLobbySessions());

        failCode = failCodeReturn(0);

        const S2CLoginResponse = {
          success: true,
          message: 'Success',
          token: token,
          myInfo: user,
          GlobalFailCode: failCode,
        };

        const gamePacket = { loginResponse: S2CLoginResponse };
        console.log(gamePacket);
        const loginSuccessResponse = createResponse(
          HANDLER_IDS.LOGIN_RESPONSE,
          socket.version,
          socket.sequence,
          gamePacket,
        );

        console.log(failCode);
        console.log('로그인 성공 / 로비 입장');
        console.log(loginSuccessResponse);
        socket.write(loginSuccessResponse);
        return;
      } else {
        // 이미 유저 세션에 포함된 상태라면
        console.log('이미 접속 중인 계정입니다.');
        return;
      }
    }
  }
};

export default loginHandler;
