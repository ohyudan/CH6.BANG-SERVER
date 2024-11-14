import Joi from 'joi';
import bcrypt from 'bcrypt';
import { PACKET_TYPES } from '../../constants/packetTypes.js';
import { GlobalFailCode } from '../../init/loadProtos.js';

const registerHandler = async ({ socket, payload }) => {
  const { id, password, email } = payload;

  const testUserInfo = {
    id: id,
    password,
    password,
  };

  const joinSchema = Joi.object({
    id: Joi.string().alphanum().lowercase().required(),
    password: Joi.string().min(4).required(),
  });

  const validateResult = joinSchema.validate(testUserInfo);

  if (validateResult.error) {
    const registerFailResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
        success: false,
        message: 'Failed',
        failcode: GlobalFailCode.AUTHENTICATION_FAILED
    });

    console.log('fail: wrong value');
    socket.write(registerFailResponse);
    return;
}
};

export default registerHandler;
