import onData from './onData.js';
import onEnd from './onEnd.js';
import onError from './onError.js';
import onClose from './onClose.js';
/**
 * 첫 접속 시 소켓 커링
 * @param {Socket} socket
 */
const onConnection = (socket) => {
  try {
    console.log(`새로운 클라이언트가 연결: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.buffer = Buffer.alloc(0);

    socket.on('data', onData(socket));
    socket.on('end', onEnd(socket));
    socket.on('error', onError(socket));
    socket.on('close', onClose(socket));
  } catch (err) {
    console.error('커넥션 중에 에러 발생', err);
  }
};

export default onConnection;
