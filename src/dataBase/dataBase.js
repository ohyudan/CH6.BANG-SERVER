import mysql from 'mysql2/promise';
import Config from '../config/config';
const createPoolSQL = () => {
  const pool = mysql.createPool({});
};
