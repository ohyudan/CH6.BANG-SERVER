import { createResponse } from '../../utils/response/createResponse.js';
import HANDLER_IDS from '../../constants/handlerIds.js';
import createFailCode from '../../utils/response/createFailCode.js';
import roomList from '../../model/room/roomList.class.js';
import playerList from '../../model/player/playerList.class.js';
import gamePrepareNotification from '../../utils/notification/gameStatus/gamePrepare.notification.js';
import loadCardInit from '../../utils/cardDeck.js';
import { ROOM_STATE } from '../../constants/room.enum.js';
import shuffle from 'lodash/shuffle.js';
import { getGameAssets } from '../../init/loadGameAssets.js';

export const gamePrepareHandler = async ({ socket, payload }) => {
  try {
    let success = true;
    let failCode = createFailCode(0);

    const gameAssets = getGameAssets();

    const ownerUser = playerList.getPlayer(socket.id);
    // 방 정보 가져오기
    const room = ownerUser ? roomList.getRoom(ownerUser.currentRoomId) : undefined;

    if (!(room == undefined)) {
      // 방장 여부 확인
      if (!(ownerUser.id === room._ownerId)) {
        success = false;
        failCode = createFailCode(13); // NOT_ROOM_OWNER
      }
    } else {
      success = false;
      failCode = createFailCode(8); // 룸 못찾음
    }

    // 방 상태를 PREPARE로 설정
    if (!room.startGame()) {
      success = false;
      failCode = createFailCode(12); // INVALID_ROOM_STATE
    }

    const inGameUsers = room.getAllPlayers();

    /**
     * 캐릭터 셔플 및 배분
     * 1. 캐릭터 셔플 후 사용자에게 배분
     * 2. 각 캐릭터의 hp 설정
     */

    const shuffledCharacter = shuffle(gameAssets.characterType.characterTypes);
    inGameUsers.forEach((user, i) => {
      const characterData = shuffledCharacter.pop();
      user.setCharacterType(characterData.type); // 캐릭터 유형 설정
      user.setHp(characterData.hp);
    });

    /**
     * 역할(RoleType) 배분
     * 2인~7인 플레이어 기준으로 역할 셔플 후 배분
     */

    const roleTypeClone = gameAssets.roleTypes.roleTypes[inGameUsers.size];
    const shuffledRoleType = shuffle(roleTypeClone); // 역할 셔플
    inGameUsers.forEach((user, i) => {
      const roleType = shuffledRoleType.pop();
      user.setCharacterRoleType(roleType.roleType); // 역할 설정
      if (user.characterData.roleType === 1) {
        const matchedCharacter = gameAssets.characterType.characterTypes.find(
          (character) => character.type === user.characterData.roleType,
        );
        if (matchedCharacter) {
          user.increaseHp(); // TARGET 역할의 경우 hp 추가
        }
      }
    });

    // 카드 배분
    inGameUsers.forEach((user) => {
      // 1. 임시로 사람별 패 구성
      user.characterData.handCards = room.cardDraw(user.characterData.hp);
      user.increaseHandCardsCountParam(user.characterData.hp);
    });

    /**
     * 게임 준비 알림 전송
     * 사용자에게 각자의 데이터 전달
     */

    room.setState(ROOM_STATE.PREPARE);
    gamePrepareNotification(room, ownerUser);

    // 응답 생성
    const S2CGamePrepareResponse = {
      success,
      failCode,
    };

    const gamePacket = {
      gamePrepareResponse: S2CGamePrepareResponse,
    };

    const response = createResponse(
      HANDLER_IDS.GAME_PREPARE_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    socket.write(response);
  } catch (error) {
    console.error('게임 준비 중 오류 발생:', error);

    const S2CGamePrepareResponse = {
      success: false,
      failCode: createFailCode(1), // UNKNOWN_ERROR
    };

    const gamePacket = {
      gamePrepareResponse: S2CGamePrepareResponse,
    };

    const response = createResponse(
      HANDLER_IDS.GAME_PREPARE_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );
    room.setState(ROOM_STATE.WAIT);
    socket.write(response);
  }
};

export default gamePrepareHandler;

/* 게임 시작 전 역할 및 캐릭터 셔플하여 결정 후 클라로 전송
message C2SGamePrepareRequest {

}

message S2CGamePrepareResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
    
enum RoleType {           (2인: 타겟1, 히트맨1)
    NONE_ROLE = 0;        (3인: 타겟1, 히트맨1, 싸이코패스1)
    TARGET = 1;           (4인: 타겟1, 히트맨2, 싸이코패스1)
    BODYGUARD = 2;        (5인: 타겟1, 보디가드1, 히트맨2, 싸이코패스1)
    HITMAN = 3;           (6인: 타겟1, 보디가드1, 히트맨3, 싸이코패스1)
    PSYCHOPATH = 4;       (7인: 타겟1, 보디가드2, 히트맨3, 싸이코패스1)
}
1.RoleType[inGameUsers.length]
2.셔플(RoleType)
3.플레이어한테 부여 array.pop

const RoleType = {
    2: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN], 
    3: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH], 
    4: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
    5: [Packets.RoleType.TARGET, Packets.RoleType.BODYGUARD, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, PSYCHOPATH],
    6: [Packets.RoleType.TARGET, Packets.RoleType.BODYGUARD, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, HITMAN, PSYCHOPATH],
    7: [Packets.RoleType.TARGET, Packets.RoleType.BODYGUARD, Packets.RoleType.BODYGUARD, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
}
    
enum CharacterType {
    NONE_CHARACTER = 0;
    RED = 1; // 빨강이              (id: 1, hp: 4, phase 빵야 제한 없음)
    SHARK = 3; // 상어군            (id: 3, hp: 4, 상대 유저는 쉴드 2개 필요)
    MALANG = 5; // 말랑이           (id: 5, hp: 4, 생명력 1 감소마다 카드 1장 획득)
    FROGGY = 7; // 개굴군           (id: 7, hp: 4, 표적이 될 때, 25%로 공격 방어)
    PINK = 8; // 핑크군             (id: 8, hp: 4, 남은 카드가 없을 시 카드 1장 획득)
    SWIM_GLASSES = 9; // 물안경군   (id: 9, hp: 4, 미니맵에 2명의 위치가 표시됨[최대 4명까지])
    MASK = 10; // 가면군            (id: 10, hp: 4, 다른 사람이 사망 시 장비중인 카드 포함 모든 카드 획득)
    DINOSAUR = 12; // 공룡이        (id: 12, hp: 3, 다른 유저들에게서 미니맵 상 위치 숨김)
    PINK_SLIME = 13; // 핑크슬라임  (id: 13, hp: 3, 피격 시 가해자의 카드 1장 획득)
}
*/
/*
const characterType = [
{type: Packets.CharacterType.RED, hp: 4},
{type: Packets.CharacterType.SHARK, hp: 4},
{type: Packets.CharacterType.MALANG, hp: 4},
{type: Packets.CharacterType.FROGGY, hp: 4},
{type: Packets.CharacterType.PINK, hp: 4},
{type: Packets.CharacterType.SWIM_GLASSES, hp: 4},
{type: Packets.CharacterType.MASK, hp: 4},
{type: Packets.CharacterType.DINOSAUR, hp: 3},
{type: Packets.CharacterType.PINK_SLIME, hp: 3},
]
*/
