import envFiles from '../constants/env.js';
import { HEADER, TOTAL_LENGTH } from '../constants/header.js';

export const Config = {
  SERVER: {
    HOST: envFiles.SERVER.HOST,
    PORT: envFiles.SERVER.PORT,
    VERSION: envFiles.SERVER.VERSION,
  },
  CLINET: {
    VERSION: envFiles.CLIENT.VERSION,
  },
  PACKET: {
    PACKET_TYPE_LENGTH: HEADER.PACKET_TYPES_LENGTH,
    VERSION_LENGTH: HEADER.VERSION_LENGTH,
    SEQUENCE_LENGTH: HEADER.SEQUENCE_LENGTH,
    PAYLOAD_LENGTH: HEADER.PAYLOAD_LENGTH,
    TOTAL_LENGTH: TOTAL_LENGTH,
  },
  DATABASE: {
    NAME: envFiles.DB1.NAME,
    USER: envFiles.DB1.USER,
    PASSWORD: envFiles.DB1.PASSWORD,
    HOST: envFiles.DB1.HOST,
    PORT: envFiles.DB1.PORT,
  },
  PHASE: {
    AFTER: 150000,
    END: 30000,
  },
  MAX_SEQUENCE_DIFF: 5,

  SALTROUNDS: 10,
};

export default Config;
