import envFiles from '../constants/env.js';
import {
  PACKET_TYPE_LENGTH,
  VERSION_LENGTH,
  SEQUENCE_LENGTH,
  PAYLOAD_LENGTH,
} from '../constants/packetTypes.js';

const config = {
  server: {
    host: envFiles.Server.HOST,
    port: envFiles.Server.PORT,
  },
  client: {
    clientVersion: envFiles.Server.CLIENT_VERSION,
  },
  packet: {
    packetTypeLength: PACKET_TYPE_LENGTH,
    versionLength: VERSION_LENGTH,
    sequenceLength: SEQUENCE_LENGTH,
    payloadLength: PAYLOAD_LENGTH,
  },
  database: {
    database: envFiles.DB1.NAME,
    user: envFiles.DB1.USER,
    password: envFiles.DB1.PASSWORD,
    host: envFiles.DB1.HOST,
    port: envFiles.DB1.PORT,
  },
};

export default config;