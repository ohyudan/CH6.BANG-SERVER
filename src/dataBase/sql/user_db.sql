CREATE TABLE IF NOT EXISTS `user`
(
  user_id       INT           PRIMARY KEY AUTO_INCREMENT,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  nickname      VARCHAR(255)  NOT NULL,
  password      VARCHAR(255)  NOT NULL,
--   last_login    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
