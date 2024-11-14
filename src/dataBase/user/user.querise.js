// SQL 관련 query문
export const SQL_QUERIES = {
  FIND_USER_BY_NAME_ID: 'SELECT * FROM sqlusers WHERE name_id = ?',
  CREATE_USER: 'INSERT INTO sqlusers (name_id, password) VALUES (?, ?)',
};
