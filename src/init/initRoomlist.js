/** 일종의 싱글턴
 * 싱글턴 이유 : 서버에서 하나만 있어야되니 서버 생성단에서 하나만 생성
 * 게임에 단 하나의 방 리스트만 있으면 됨.
 */
const roomList = new Map();

export default roomList;
