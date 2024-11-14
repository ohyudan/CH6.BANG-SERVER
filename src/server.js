import net from 'net';
import Config from './config/config.js';
import initServer from './init/initServer.js';
import onConnection from './events/onConnection.js';

const server = net.createServer(onConnection);

const startServer = async () => {
  try {
    await initServer();

    server.listen(Config.server.port, Config.server.host, () => {
      console.log(`${Config.server.port}:${Config.server.host}로 서버가 열렸습니다.`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

startServer();
