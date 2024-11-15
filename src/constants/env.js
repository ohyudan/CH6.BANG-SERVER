import dotenv from 'dotenv';

dotenv.config();

const envFiles = {
  SERVER: {
    PORT: process.env.PORT || 6000,
    HOST: process.env.HOST || 'localhost',
    VERSION: process.env.VERSION || '1.0.0',
  },
  CLIENT: {
    VERSION: process.env.VERSION || '1.0.0',
  },
  DB1: {
    NAME: process.env.DB_NAME || 'bang_db',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'aaaa4321',
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || '3306',
  },
  AUTH: {
    SECRET_KEY: process.env.SECRET_KEY,
  }
};

export default envFiles;
