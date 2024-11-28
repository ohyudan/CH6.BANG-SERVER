import playerList from '../model/player/playerList.class.js';
import roomList from '../model/room/roomList.class.js';

const onClose = (socket) => async () => {
  try {
    console.log(`클라이언트 연결 종료 : ${socket.remoteAddress}:${socket.remotePort}`);

    // 1. 플레이어 찾기
    const player = playerList.getPlayer(socket.id);

    console.log(`플레이어 ID: ${player.id}, 닉네임 : ${player._nickname}`);

    // 플레이어가 속한 방 처리
    const roomId = player.currentRoomId;
    if (roomId !== undefined && roomId !== null) {
      const room = roomList.getRoom(roomId);

      if (room) {
        console.log(`${room.id}번 방에서, 플레이어 ID: ${player.id} 제거됨`);
        room.subPlayer(player);

        // 방에 플레이어가 없으면 방 삭제
        if (room.getAllPlayers().size === 0) {
          console.log(`${room.id}번 방 삭제`);
          roomList.subRoomList(room);
        }
      } else {
        console.warn(`플레이어가 속한 방을 찾을 수 없습니다. Room ID: ${roomId}`);
      }
    }
    // 3. 플레이어 리스트에서 제거
    playerList.subPlayer(player.id);
  } catch (error) {
    console.error(`onClose 처리 중 오류 발생 ${error.message}`);
  }
};
export default onClose;
