import Config from '../../config/config.js';

/**
 * version 검증하는 함수
 * @param {Socket} socket
 * @param {String} newVersion
 * @returns {boolean}
 */
export const validateVersion = (socket, newVersion) => {
  socket.version = newVersion;

  if (newVersion !== Config.CLINET.VERSION) return false;

  return true;
};
