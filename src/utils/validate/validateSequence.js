import Config from '../../config/config.js';

/**
 * sequence 검증 함수
 * @param {Socket} socket
 * @param {number} newSequence
 * @returns {boolean}
 */
export const validateSequence = (socket, newSequence) => {
  if (!socket.sequence) {
    socket.sequence = newSequence;
    return true;
  }

  const sequenceDiff = newSequence - socket.sequence;

  if (sequenceDiff > Config.MAX_SEQUENCE_DIFF || sequenceDiff < 0) return false;
  socket.sequence = newSequence;

  return true;
};
