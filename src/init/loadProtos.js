import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';
// import CustomError from '../utils/error/customError.js';
// import { ErrorCodes } from '../utils/error/errorCodes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoPath  = path.resolve(__dirname, '../protobuf/game/game.proto');
/**
 * .proto 파일들을 전부 가져오는 함수
 * @param {*} protoFolder
 * @param {*} fileList
 * @returns
 */

// ../protobuf 폴더 안에 있는 .proto 파일들을 fileList 변수에 담아 반환
const getAllProtoFiles = (protoFolder, fileList = []) => {
  const files = fs.readdirSync(protoFolder);

  files.forEach((file) => {
    const filePath = path.join(protoFolder, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

export let GamePacket = null;
export let GlobalFailCode = null;

export const loadProtos = async () => {
  try {
    const root = await protobuf.load(protoPath);
    GamePacket = root.lookupType('GamePacket');

    if(GamePacket) {'GamePacket load success'};

    GlobalFailCode = root.lookupEnum('GlobalFailCode');
    console.log(GlobalFailCode);
    console.log(`프로토 타입 로드 완료`);
  } catch (error) {
    // throw new CustomError(ErrorCodes.PROTOFILE_LOADING_FAIL, `프로토 로딩 중 에러 발생`);
    console.error(error);
  }
};

/**
 * 등록한 protoMessages를 가져오는 함수
 * @returns {Object}
 */
export const getProtoMessages = () => {
  return { ...protoMessages };
};
