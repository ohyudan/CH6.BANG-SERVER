import HANDLER_IDS from "../../constants/handlerIds.js";
import { getRoomSessions } from "../../session/room.session.js";
import { getUserById } from "../../session/user.session.js";
import { createResponse } from "../response/createResponse.js";

export const roomJoinNotifcation = (roomId, userId) => {
    // 1. 매개변수 user는 새로 입장한 유저이다. 이 유저를 제외한 나머지 유저들을 users에서 검색
    const newUser = getUserById(userId);
    const thisRoom = getRoomSessions().find((room) => room.id === roomId);
    const otherUsers = thisRoom.users.filter((user) => user.id !== userId);

    // 2. 나머지 유저들에게 입장한 새로운 유저에 대한 정보를 알림
    otherUsers.forEach((user) => {
      const S2CJoinRoomNotification = {
        joinUser: newUser,
      };
      
      const gamePacket = { joinRoomNotification: S2CJoinRoomNotification };

      const joinRoomNotification = createResponse(
        HANDLER_IDS.JOIN_ROOM_NOTIFICATION,
        user.socket.version,
        user.socket.sequence,
        gamePacket,
      );

      console.log(`userId: ${user.id}, userSocket: ${user.socket}`);
      user.socket.write(joinRoomNotification);
    });

    return;
  }