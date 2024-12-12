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

  /**
   *
   * @param {*} roomId
   * @param {*} playerList
   */
  createGameSession: async (roomId, playerList) => {
    const key = `${GAME_SESSION_PREFIX}:${roomId}`;
    for (const values of playerList) {
      await redisClient.sadd(key, values[1].id);

      await redisClient.expire(key, 3600);
    }
  },

  reomveUserGameSession: async (roomId, playerId) => {
    const keyPlayer = `${PLAYER_PREFIX}:${playerId}`;
    const keyRoom = `${GAME_SESSION_PREFIX}:${roomId}`;
    await redisClient.del(keyPlayer);
    await redisClient.srem(keyRoom, playerId);

    const remainingPlayers = await redisClient.smembers(keyRoom);
    if (remainingPlayers.length === 0) {
      await redisClient.del(keyRoom);
    }
  },
  /**
   *
   * @param {*} playerList
   */
  allAddPlayerGameSession: async (playerList) => {
    for (const values of playerList) {
      const key = `${PLAYER_PREFIX}:${values[1].id}`;
      await redisClient.hset(key, {
        id: values[1].id,
        nickname: values[1].nickname,
        currentRoomId: values[1].currentRoomId,
        character: JSON.stringify({
          characterType: values[1].characterData.characterType,
          roleType: values[1].characterData.roleType,
          hp: values[1].characterData.hp,
          weapon: values[1].characterData.weapon,
        }),
        stateInfo: JSON.stringify({
          state: values[1].characterData.stateInfo.state,
          nextState: values[1].characterData.stateInfo.nextState,
          nextStateAt: values[1].characterData.stateInfo.nextStateAt,
          sstateTargetUserId: values[1].characterData.stateInfo.sstateTargetUserId,
        }),
        equips: values[1].characterData.equips,
        debuffs: values[1].characterData.debuffs,
        handCards: JSON.stringify(values[1].characterData.getAllhandCard()),
        bbangCount: values[1].characterData.bbangCount,
        handCardsCount: values[1].characterData.handCardsCount,
      });
      await redisClient.expire(key, 3600);
    }
  },

  updataPlayerField: async (playerId, field, vlaue) => {
    const key = `${PLAYER_PREFIX}:${playerId}`;

    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(vlaue) : vlaue;
      await redisClient.hset(key, field, stringValue);
      await redisClient.expire(key, 3600);
    } catch (error) {
      console.error('유저 필드 업데이트 실패 ');
    }
  },

  getUser: async (playerId) => {
    try {
      const data = await redisClient.hget(`${PLAYER_PREFIX}:${playerId}`, field);
      if (!data) return null;
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
export default redis;
