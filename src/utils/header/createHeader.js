import config from '../../config/config.js';

/* 패킷 명세서
packetType (ushort)     : 패킷 타입 (2바이트)
versionLength (ubyte)   : 버전 길이 (1바이트)
version (string)        : 버전 (문자열)
sequence (uint32)       : 패킷 번호 (4바이트)
payloadLength (uint32)  : 데이터 길이 (4바이트)
payload (bytes)         : 실제 데이터
*/

export const createHeader = (packetType, payload, sequence) => {
  const version = config.client.clientVersion;
  const versionLength = version.length;
  const payloadLength = Buffer.byteLength(payload);

  const packetTypeBuffer = Buffer.alloc(config.packet.packetTypeLength);
  packetTypeBuffer.writeUInt16BE(packetType);

  const versionLengthBuffer = Buffer.alloc(config.packet.versionLength);
  versionLengthBuffer.writeUInt8(versionLength);

  const versionBuffer = Buffer.alloc(versionLength);
  versionBuffer.write(version);

  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUInt32BE(sequence);

  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUInt32BE(payloadLength);

  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
  ]);
};
