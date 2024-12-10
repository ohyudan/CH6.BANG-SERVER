import Redis from 'ioredis';
import Config from '../../config/config.js';

const createRedis = () => {
  const redisClient = new Redis({
    host: Config.REDIS.HOST,
    port: Config.REDIS.PORT,
    password: Config.REDIS.PASSWORD,
    db: Config.REDIS.NUMBER,
    retryStrategy: (times) => {
      return Math.min(times * 50, 4000);
    },
  });
  return redisClient;
};
const redisClient = createRedis();
export default redisClient;
