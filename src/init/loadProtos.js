import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import protobuf from 'protobufjs';
import packetNames from '../protobuf/packetsName.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const protoFolder = path.join(dirname, '../protobuf');

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

const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(
      protoFiles.map((file) => {
        return root.load(file);
      }),
    );

    for (let [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};

      for (const [protoType, typeName] of Object.entries(types)) {
        try {
          protoMessages[packageName][protoType] = root.lookupType(typeName);
        } catch (error) {
          protoMessages[packageName][protoType] = root.lookupEnum(typeName);
        }
      }
    }

    console.log(`프로토 타입 로드에 끝났습니다.`);
  } catch (error) {
    throw new CustomError(ErrorCodes.PROTOFILE_LOADING_FAIL, `프로토 로딩 중 에러 발생`);
  }
};

/**
 * 등록한 protoMessages를 가져오는 함수
 * @returns {Object}
 */
export const getProtoMessages = () => {
  return { ...protoMessages };
};
