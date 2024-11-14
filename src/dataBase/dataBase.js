import mysql from 'mysql2/promise';
import config from '../config/config.js';
import { formatDate } from '../utils/formatDate.js';
const createPool = () => {
  const pool = mysql.createPool({
    ...config.database,
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
