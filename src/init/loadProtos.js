import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import protobuf from 'protobufjs';
import packetNames from '../protobuf/packetNames.js';
// import CustomError from '../utils/error/customError.js';
// import { ErrorCodes } from '../utils/error/errorCodes.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const protoFolder = path.join(dirname, '../protobuf');
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

const protoFiles = getAllProtoFiles(protoFolder);
// \src\\protobuf\\game\\game.proto'를 반환한다. proto 파일들의 리스트를 반환
// console.log(protoFiles);
const protoMessages = {};

/**
 * protoMessages에 가져온 protoFiles를 등록하는 함수
 */
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();
    // console.log(root); // 프로토버퍼의 형태를 가진 변수 선언
    await Promise.all(
      protoFiles.map((file) => {
        return root.load(file);
      }),
    );
    // proto 파일들의 리스트에서 하나 하나 root 형식에 맞춰 map 함수를 사용해 객체를 반환
    // console.log(root); //모든 proto 파일들에 있는 데이터를 root 형식으로 저장한 객체
    for ( const typeName of Object.values(packetNames)){
      protoMessages[typeName] = root.lookupType(typeName);
    }

    console.log(`프로토 타입 로드 완료`);
    // console.log(protoMessages);
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
