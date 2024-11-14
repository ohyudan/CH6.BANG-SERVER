import { loadProtos } from './loadProtos.js';

/**
 * 서버 시작시 필요한 정보를 로드하는 함수
 */
const initServer = async () => {
  await loadProtos();
};

export default initServer;
