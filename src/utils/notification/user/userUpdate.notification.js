import HANDLER_IDS from "../../../constants/handlerIds.js";
import { createResponse } from "../../response/createResponse.js";

const userUpdateNotification = (room) => {
    const inGameUsers = Array.from(room.getAllPlayers().values());
    
    inGameUsers.forEach((player) => {
      const S2CUserUpdateNotification = { user: player.getAllUsersData() };
    
      const updatePacket = { userUpdateNotification: S2CUserUpdateNotification };
    
      const userUpdateNotification = createResponse(
        HANDLER_IDS.USER_UPDATE_NOTIFICATION,
        player.socket.version,
        player.socket.sequence,
        updatePacket,
      );
    
      player.socket.write(userUpdateNotification);
    });
}

export default userUpdateNotification;