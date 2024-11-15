import Config from '../../config/config.js';

/**
 * 역직렬화 함수
 * @param {Socket} socket
 * @returns { packetType, version, sequence, payloadLength, offset } 역직렬화한 데이터
 */
export const deserialize = async (socket) => {
  let offset = 0;

  const packetType = socket.buffer.readUInt16BE(offset); //2바이트
  offset += Config.PACKET.PACKET_TYPE_LENGTH;

  const versionLength = socket.buffer.readUInt8(offset); //1바이트
  offset += Config.PACKET.VERSION_LENGTH;

  const version = socket.buffer.subarray(offset, offset + versionLength).toString('utf-8'); // 크기 가변적 '1.0.0'=5
  offset += versionLength;

  const sequence = socket.buffer.readUInt32BE(offset); //4바이트
  offset += Config.PACKET.SEQUENCE_LENGTH;

  const payloadLength = socket.buffer.readUInt32BE(offset); //4바이트
  offset += Config.PACKET.PAYLOAD_LENGTH;

  return { packetType, version, sequence, payloadLength, offset };
};

/**
 * 직렬화 함수
 * @param {Number} packetType
 * @param {Number} sequence
 * @param {Object} payload
 * @returns { Buffer } 헤더와 페이로드가 합쳐진 패킷
 */
export const serialize = (packetType, version, sequence, payload) => {
  const versionBuffer = Buffer.from(version, 'utf-8'); // 버전 문자열을 버퍼로 변환
  const versionLength = versionBuffer.length;
  const payloadLength = payload.length;
  const buffer = Buffer.alloc(Config.PACKET.TOTAL_LENGTH);
  let offset = 0;

  // packetType 쓰기 (2바이트)
  buffer.writeUInt16BE(packetType, offset);
  offset += Config.PACKET.PACKET_TYPE_LENGTH;

  // version 길이 쓰기 (1바이트)
  buffer.writeUInt8(versionLength, offset);
  offset += Config.PACKET.VERSION_LENGTH;

  // version 쓰기 (5바이트)
  versionBuffer.copy(buffer, offset);
  offset += versionLength;

  // sequence 쓰기 (4바이트)
  buffer.writeUInt32BE(sequence, offset);
  offset += Config.PACKET.SEQUENCE_LENGTH;

  // payload 길이 쓰기 (4바이트)
  buffer.writeUInt32BE(payloadLength, offset);
  offset += Config.PACKET.PAYLOAD_LENGTH;

  // payload 쓰기 (가변 길이)
  const result = Buffer.concat([buffer, payload]);
  offset += payloadLength;
  return result;
};
