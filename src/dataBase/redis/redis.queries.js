import playerList from '../../model/player/playerList.class.js';
import redisClient from './redis.js';

const PLAYER_PREFIX = 'player';
const GAME_SESSION_PREFIX = 'gameSession';

//게임 시작 누르면 전환 시작
const redis = {
  // 찾기
  // 더하기
  // 빼기

  // 방 -> 게임 세션으로 변경
  // 룸페이즈 , 룸 덱 리스트 , 플레이어 리스트
  // 플레이어만 변경
  createGameSession: async (roomId) => {
    const key = `${GAME_SESSION_PREFIX}:${roomId}`;
    await redisClient.hset(key, {});
    //await redisClient.hset(key);
  },

  reomveUserGameSession: async (playerId) => {
    await redisClient;
  },

  allAddPlayerGameSession: async (playerList) => {
    playerList.forEach(async (values) => {
      const key = `${GAME_SESSION_PREFIX}:${values.id}`;
      await redisClient.hset(key, {
        id: values.id,
        nickname: values.nickname,
        currentRoomId: values.currentRoomId,
        character: {
          characterType: this.characterData.characterType,
          roleType,
        },
      });
    });
  },
};
