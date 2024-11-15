// SQL 관련 query문
export const SQL_QUERIES = {
  FIND_USER_BY_EMAIL: 'SELECT * FROM sqlusers WHERE email = ?',
  FIND_USER_BY_NICKNAME: 'SELECT * FROM sqlusers WHERE nickname = ?',
  CREATE_USER: 'INSERT INTO sqlusers (email, nickname, password) VALUES (?, ?, ?)',
};
