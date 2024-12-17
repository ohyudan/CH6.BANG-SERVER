import { ROLE_TYPE } from '../../../constants/user.enum.js';
import { WIN_TYPE } from '../../../constants/room.enum.js';
import { createResponse } from '../../response/createResponse.js';
import roomList from '../../../model/room/roomList.class.js';
import HANDLER_IDS from '../../../constants/handlerIds.js';

const gameEndNotification = (roomId) => {
  try {
    // 해당 방 찾기
    const room = roomList.getRoom(roomId);
    if (!room) {
      console.error('방을 찾을 수 없습니다.');
      return;
    }

    // 플레이어 리스트 가져오기
    const roomPlayList = room.getAllPlayers();

    // Map을 배열로 변환 후 filter 적용
    const survivors = Array.from(roomPlayList.values()).filter(
      (player) => player.characterData.hp > 0,
    );

    // 각 역할별로 생존자 확인
    const isTarget = survivors.find((player) => player.characterData.roleType === ROLE_TYPE.TARGET);
    const isBodyguard = survivors.find(
      (player) => player.characterData.roleType === ROLE_TYPE.BODYGUARD,
    );
    const isHitman = survivors.find((player) => player.characterData.roleType === ROLE_TYPE.HITMAN);
    const isPsychopath = survivors.find(
      (player) => player.characterData.roleType === ROLE_TYPE.PSYCHOPATH,
    );

    console.log('생존자 수:', survivors.length);
    console.log('생존 역할:', {
      Target: isTarget ? '생존' : '사망',
      Bodyguard: isBodyguard ? '생존' : '사망',
      Hitman: isHitman ? '생존' : '사망',
      Psychopath: isPsychopath ? '생존' : '사망',
    });

    let responsePayload;
    let winners = null;

    // 승리 조건에 따라 결과 생성
    if (!isTarget && !isBodyguard && !isHitman) {
      // 싸이코패스 승리
      winners = Array.from(roomPlayList.values()).filter(
        (player) => player.characterData.roleType === ROLE_TYPE.PSYCHOPATH,
      );
      const winnerIds = winners.map((player) => player.id);
      responsePayload = {
        gameEndNotification: {
          winners: winnerIds,
          winType: WIN_TYPE.PSYCHOPATH_WIN,
        },
      };
      console.log(
        '게임 종료 - 싸이코패스 승리! 승자:',
        winners.map((w) => w._nickname),
      );
    } else if (!isHitman && !isPsychopath) {
      // 타겟 & 보디가드 승리
      winners = Array.from(roomPlayList.values()).filter(
        (player) =>
          player.characterData.roleType === ROLE_TYPE.TARGET ||
          player.characterData.roleType === ROLE_TYPE.BODYGUARD,
      );
      const winnerIds = winners.map((player) => player.id);
      responsePayload = {
        gameEndNotification: {
          winners: winnerIds,
          winType: WIN_TYPE.TARGET_AND_BODYGUARD_WIN,
        },
      };
      console.log(
        '게임 종료 - 타겟&보디가드 승리! 승자:',
        winners.map((w) => w._nickname),
      );
    } else if (!isTarget) {
      // 히트맨 승리
      winners = Array.from(roomPlayList.values()).filter(
        (player) => player.characterData.roleType === ROLE_TYPE.HITMAN,
      );
      const winnerIds = winners.map((player) => player.id);
      responsePayload = {
        gameEndNotification: {
          winners: winnerIds,
          winType: WIN_TYPE.HITMAN_WIN,
        },
      };
      console.log(
        '게임 종료 - 히트맨 승리! 승자:',
        winners.map((w) => w._nickname),
      );
    }

    if (responsePayload) {
      // 각 플레이어에게 알림 전송
      roomPlayList.forEach((values) => {
        const result = createResponse(
          HANDLER_IDS.GAME_END_NOTIFICATION,
          values.socket.version,
          values.socket.sequence,
          responsePayload,
        );
        values.socket.write(result);
      });

      // 방 삭제
      roomList.subRoomList(room);
      console.log('게임 방 삭제 완료');
    }
  } catch (error) {
    console.error('게임 종료 처리 중 오류 발생:', error);
  }
};

export default gameEndNotification;
