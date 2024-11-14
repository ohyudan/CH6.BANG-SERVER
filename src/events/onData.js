import { serialize, deserialize } from '../utils/Packet/serialize.js';
import { packetParser } from '../utils/Packet/PacketParser.js';
import { handler } from '../handler/index.js';

/**
 * 클라이언트로 받은 데이터 확인
 * @param {Socket} socket
 * @returns
 */
const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  // console.log('디버그 버퍼 확인 콘솔(onData):');
  console.log(data);

  // 데이터 검증 절차 필요

  const deserializeData = await deserialize(socket);

  const packet = socket.buffer.subarray(
    deserializeData.offset,
    deserializeData.offset + deserializeData.payloadLength,
  );
  const payload = await packetParser(packet);

  console.log(payload);

  // 핸들러 이벤트 필요
  // await handler()
};

export default onData;
