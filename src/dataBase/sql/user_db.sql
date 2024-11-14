CREATE TABLE IF NOT EXISTS `user`
(
  user_id       INT           PRIMARY KEY AUTO_INCREMENT,
  id            VARCHAR(255)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
--   last_login    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
-- email은 id와 같은 값으로 보낸다.