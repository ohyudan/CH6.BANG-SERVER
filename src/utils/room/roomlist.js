import roomList from '../../init/initroomlist.js';
// 방 아이디 , 플레이어 아이디 문제
/**
 * 싱글턴 관리
 * @returns {Map}
 */
const getRoomList = () => {
  return roomList;
};
/**
 *
 * @param {Room} room 추가할 룸 인스턴스
 */
const addRoomList = (room) => {
  // 해당 키가 있는 지 검사 후 set할것
  roomList.set(room.id, room);
};
/**
 *
 * @param {Room} room 삭제할 룸 인스턴스
 */
const subRoomList = (room) => {
  roomList.delete(room.id);
};
export { getRoomList, addRoomList, subRoomList };
