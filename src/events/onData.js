import Config from '../config/config.js';
import { deserialize } from '../utils/Packet/serialize.js';
import { validateVersion } from '../utils/validate/validateVersion.js';
import { validateSequence } from '../utils/validate/validateSequence.js';
import packetParser from '../utils/Packet/packetParser.js';
import { handlerError } from '../error/errorHandler.js';
import { CustomError } from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';
import { handler } from '../handlers/index.js';
const onData = (socket) => async (data) => {
  // data는 클라이언트가 전송한 버퍼+패킷
  // socket.buffer는 <Buffer > 의 형태인 빈 버퍼 깡통
  console.log(data);
  try {
    socket.buffer = Buffer.concat([socket.buffer, data]);

    while (socket.buffer.length >= Config.PACKET.TOTAL_LENGTH) {
      const deserializeData = await deserialize(socket);

      if (!validateVersion(socket, deserializeData.version))
        throw new CustomError(ErrorCodes.CLIENT_VERSION_MISMATCH, `버전이 일치하지 않습니다`);

      if (!validateSequence(socket, deserialize.sequence))
        throw new CustomError(ErrorCodes.INVALID_SEQUENCE, `시퀀스가 변조되었습니다.`);

      const requiredLength = deserializeData.offset + deserializeData.payloadLength;

      if (socket.buffer.length >= requiredLength) {
        const packet = socket.buffer.subarray(deserializeData.offset, requiredLength);
        socket.buffer = socket.buffer.subarray(requiredLength);
        console.log(packet);
        const payload = packetParser(packet);

        await handler(socket, deserializeData.packetType, payload);
        break;
      }
    }
  } catch (error) {
    //await handlerError();
    console.error(error);
  }
};

export default onData;
