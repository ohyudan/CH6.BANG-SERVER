import net from 'net';

import Config from './config/config.js';
import initServer from './init/initServer.js';
import onConnection from './events/onConnection.js';

const server = net.createServer(onConnection);

const startServer = async () => {
  try {
    await initServer();

    server.listen(Config.SERVER.PORT, Config.SERVER.HOST, () => {
      console.log(`${Config.SERVER.HOST}:${Config.SERVER.PORT}로 서버가 열렸습니다.`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

startServer();
