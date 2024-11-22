import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CustomError from '../error/customError.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
//const gameAssetPath = path.resolve(__dirname, '../../gameAsset/');
const gameAssetFolder = path.join(dirname, '../../gameAssets');
let parsedData;

// 모든 Json 파일 가져오기
const getAllGameAssetFiles = (gameAssetFolder, fileList = []) => {
  const files = fs.readdirSync(gameAssetFolder);

  files.forEach((file) => {
    const filePath = path.join(gameAssetFolder, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllGameAssetFiles(filePath, fileList);
    } else if (path.extname(file) === '.json') {
      fileList.push(filePath);
    }
  });
  return fileList;
};
const gameAssetsFiles = getAllGameAssetFiles(gameAssetFolder);

const gameAssets = {};

export const loadGameAssets = async () => {
  try {
    for (const filePath of gameAssetsFiles) {
      const fileContent = fs.readFileSync(filePath, 'utf-8'); // JSON 파일을 동기적으로 읽음
      const jsonData = JSON.parse(fileContent); // JSON 데이터를 객체로 파싱

      const fileName = path.basename(filePath, '.json'); // 파일명에서 확장자 제거
      gameAssets[fileName] = jsonData; // 게임 에셋을 gameAssets 객체에 저장
    }
    console.log('게임 에셋 로드 완료');
  } catch (err) {
    //throw new CustomError(ErrorCodes.PROTOFILE_LOADING_FAIL, `게임 에셋 로드중 오류`);
    //에러코드 수정 필요
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
// try {
//   // JSON 데이터를 파일에서 읽어서 파싱
//   parsedData = JSON.parse(readFileSync(positionsPath, 'utf-8'));
//   console.log('characterPositionData.json 로드 성공');
// } catch (err) {
//   console.error('characterPositionData.json 로드 실패:', err);
//   process.exit(1); // 에러 발생 시 종료
// }

// JSON 데이터의 position 배열을 바로 초기화
//export const characterPositions = parsedData.position;
