import playerList from '../../model/player/playerList.class.js';
import roomList from '../../model/room/roomList.class.js';

const guerrilla = ({ socket, cardType, targetUserId }) => {
  const user = playerList.getPlayer(socket.id);
  const room = roomList.getRoom(user.currentRoomId);

  console.log('접근은 함');
  console.log(socket.id, cardType, targetUserId);
};

export default guerrilla;
