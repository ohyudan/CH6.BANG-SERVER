import mysql from 'mysql2/promise';
import Config from '../config/config.js';
import { formatDate } from '../utils/dateFomatter.js';


//connection pool생성
const createPoolSQL = () => {
  const pool = mysql.createPool({
    host: Config.DATABASE.HOST,
    port: Config.DATABASE.PORT,
    user: Config.DATABASE.USER,
    password: Config.DATABASE.PASSWORD,
    database: Config.DATABASE.NAME,
    waitForConnections: true,//최대 연결 수에 도달했을시 새로윤 요청 대기
    connectionLimit: 10,//최대 연결 수 10
    queueLimit: 0,//대기열의 최대길이 제한없음.
  });

  const originalQuery=pool.query;


  //log남기는 부분
  pool.query=(sql,params)=>{
    const date=new Date();//현재 시간을 date로 설정
    console.log(`${formatDate(date)} Excuting query:
      ${sql} ${params?`${JSON.stringify(params)}`:``}`);//params가 있으면 params출력 없으면 ''출력
    return originalQuery.call(pool,sql,params);
  }
  return pool;
};

const dbPool=createPoolSQL();

export default dbPool;
