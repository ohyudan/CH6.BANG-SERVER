import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../../error/customError.js';
/**
 * 페이로드 데이터를 디코딩하는 함수
 * @param { Buffer } packet
 * @returns { Object } 디코딩한 페이로드 데이터
 */
const packetParser = (packet) => {
  try {
    const protoMessages = getProtoMessages();
    const message = protoMessages.packets.GamePacket;
    let decodedPacket;

    decodedPacket = message.decode(packet);

    const fieldName = Object.keys(decodedPacket)[0];

    const payload = decodedPacket[fieldName];

    return payload;
  } catch (error) {
    //throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, `패킷 파싱 중 에러 발생`);
    console.log(error);
  }
};
export default packetParser;
