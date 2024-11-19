// SQL 관련 query문
export const SQL_QUERIES = {
  FIND_USER_BY_EMAIL: 'SELECT * FROM user WHERE email = ?',
  //   FIND_USER_BY_ACCOUNT_ID_PASSWORD: 'SELECT * FROM user WHERE'
  //   FIND_USER_BY_UUID: 'SELECT * FROM accounts WHERE uuid = ?',
  CREATE_USER: 'INSERT INTO user (email, nickname, password) VALUES (?, ?, ?)',
  //   FIND_HIGHSCORE_BY_ID: 'SELECT score FROM highScores WHERE id = ?',
  //   CREATE_HIGHSCORE: 'INSERT INTO highScores (id,score) VALUES (?,?)',
  //   UPDATE_HIGHSCORE: 'UPDATE highScores SET score = ? WHERE id = ?',
  //   CREATE_GAME_LOGS: 'INSERT INTO game_logs (host_id, oppo_id, is_win) VALUES (?, ?, ?)',
};
