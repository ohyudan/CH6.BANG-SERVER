import dotenv from 'dotenv';

dotenv.config();

const envFiles = {
  Server: {
    PORT: process.env.PORT || 6000,
    HOST: process.env.HOST || 'localhost',
  },
};

export default envFiles;
