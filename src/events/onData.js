
import { config } from '../config/config.js';
import { getHandlerById } from '../handlers/index.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { handlerError } from '../error/errorHandler.js';

const onData = (socket) => async (data) => {
  // data는 클라이언트가 전송한 버퍼+패킷
  // socket.buffer는 <Buffer > 의 형태인 빈 버퍼 깡통
  console.log(data);
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 헤더에서 버전의 정보를 가져옴 Offset [2]부터 1바이트
  const versionLength = socket.buffer.readUInt8(config.packet.packetTypeLength);

  const totalHeaderLength =
    config.packet.packetTypeLength +
    config.packet.versionLength +
    versionLength +
    config.packet.sequenceLength +
    config.packet.payloadLength;

  while (socket.buffer.length >= totalHeaderLength) {
    // 버퍼 길이가 헤더 길이보다 길때 == 내용이 존재한다는 것
    const packetType = socket.buffer.readUInt16BE(0);
    // 패킷 타입은 [0]부터 2바이트

    const payloadLength = socket.buffer.readUInt32BE(totalHeaderLength - config.packet.payloadLength);
    // 헤더에서 페이로드 길이 정보를 가져옴 [전체 헤더 길이 - 페이로드 길이]부터 4바이트

    const packetLength = totalHeaderLength + payloadLength;
    // 전체 패킷의 길이는 총합 헤더 길이 + 페이로드 길이

    if (socket.buffer.length < packetLength) {
      // 버퍼의 길이가 전체 패킷의 길이보다 적으면 오류가 있다는 것
      console.log(socket.buffer.length, ' < ', packetLength);
      console.log('길이 부족');
      break; // 중단
    }

    const payloadData = socket.buffer.slice(totalHeaderLength, packetLength); // 페이로드의 내용은 헤더를 제외한 나머지

    socket.buffer = socket.buffer.slice(packetLength); // socket.buffer를 비운다, 패킷 길이만큼 slice해서

    try {
      const { payload } = packetParser(payloadData, packetType);
      // 패킷을 packetType의 번호와 일치하는 message 형태로 parsing한다.
      // 파싱으로 클라이언트가 보낸 { payload } 데이터를 얻을 수 있다.

      const handler = getHandlerById(packetType);
      // 패킷 타입과 일치하는 핸들러를 조회

      await handler({ socket, payload });
      // 패킷 타입에 해당하는 핸들러를 실행
    } catch (err) {
      handlerError(socket, err);
    }
  }
};

export default onData;

