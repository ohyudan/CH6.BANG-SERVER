import roomList from '../../init/initroomlist';

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
  // 해당 키가 있는 지 검사 후 set
  roomList.set(room.id, room);
};
/**
 *
 * @param {Room} room 삭제할 룸 인스턴스
 */
const subRoomList = (room) => {
  roomList.delete(room.name);
};
export { getRoomList };
