import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const positionsPath = path.resolve(__dirname, '../assets/characterPositionData.json');
let parsedData;

try {
  // JSON 데이터를 파일에서 읽어서 파싱
  parsedData = JSON.parse(readFileSync(positionsPath, 'utf-8'));
  console.log('characterPositionData.json 로드 성공');
} catch (err) {
  console.error('characterPositionData.json 로드 실패:', err);
  process.exit(1); // 에러 발생 시 종료
}

// JSON 데이터의 position 배열을 바로 초기화
export const characterPositions = parsedData.position;
