import envFiles from '../constants/env.js';

const Config = {
  SERVER: {
    PORT: envFiles.Server.PORT,
    HOST: envFiles.Server.HOST,
  },
};

export default Config;
