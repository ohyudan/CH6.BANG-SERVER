import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

export const addUser = (socket, id, nickname) => {
  const user = new User(id, socket, nickname);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const userIndex = userSessions.findIndex((user) => user.socket === socket);
  // 삭제하려는 유저를 찾았다면
  if (userIndex !== -1) {
    return userSessions.splice(userIndex, 1)[0]; // 삭제된 요소를 반환
  }
};

export const getUserById = (id) => {
    return userSessions.find((user) => user.id === id);
}

export const getUserBySocket = (socket) => {
    return userSessions.find((user) => user.socket === socket);
}