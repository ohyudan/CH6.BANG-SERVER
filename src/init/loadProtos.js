import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import protobuf from 'protobufjs';
import packetNames from '../protobuf/packetNames.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const protoFolder = path.join(dirname, '../protobuf');

// 모든 .proto 파일 가져오기
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
export const Packets = {}; // Packets 객체를 통해 Protobuf에서 정의된 enum 값을 가져옴

/**
 * Protobuf 파일 로드 및 protoMessages와 Packets 객체 생성
 */
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(
      protoFiles.map((file) => {
        return root.load(file);
      }),
    );

    // protoMessages 초기화
    for (let [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};

      for (const [protoType, typeName] of Object.entries(types)) {
        try {
          const type = root.lookupType(typeName);
          protoMessages[packageName][protoType] = type;
        } catch (error) {
          const enumType = root.lookupEnum(typeName);
          protoMessages[packageName][protoType] = enumType;

          // Packets 객체에 열거형(enum) 값 등록
          if (!Packets[protoType]) {
            Packets[protoType] = enumType.values;
          }
        }
      }
    }

    console.log(`프로토 타입 로드가 완료되었습니다.`);
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
