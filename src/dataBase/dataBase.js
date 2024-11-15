import mysql from 'mysql2/promise';
import Config from '../config/config.js';
import { formatDate } from '../utils/formatDate.js';
const createPool = () => {
  const pool = mysql.createPool({
    host: Config.DATABASE.HOST,
    port: Config.DATABASE.PORT,
    user: Config.DATABASE.USER,
    password: Config.DATABASE.PASSWORD,
    database: Config.DATABASE.NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const originalQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] Excuting query: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``}`,
    );

    return originalQuery.call(pool, sql, params);
  };
  return pool;
};

const dbPool = createPool();

export default dbPool;
