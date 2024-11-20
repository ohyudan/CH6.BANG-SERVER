class Player {
  constructor(id, nickname, socket) {
    this._id = id;
    this._nickname = nickname;
    this.socket = socket;

    this.CharacterData = {
      CharacterType: undefined,
      RoleType: undefined,
      hp: undefined,
      weapon: undefined,
      CharacterStateInfoData: undefined,
      equips: [],
      debuffers: [],
      CardData: [],
      bbangCount: undefined,
      handCardCount: undefined,
    };
    this.UserData = {
      id: this._id,
      nickname: this._nickname,
      CharacterData: this.CharacterData,
    };
  }
  get id() {
    return this._id;
  }
}
export default Player;

// message UserData {
//   int64 id = 1;
//   string nickname = 2;
//   CharacterData character = 3;
// }
// enum CharacterType {
//     NONE_CHARACTER = 0;
//     RED = 1; // 빨강이
//     SHARK = 3; // 상어군
//     MALANG = 5; // 말랑이
//     FROGGY = 7; // 개굴군
//     PINK = 8; // 핑크군
//     SWIM_GLASSES = 9; // 물안경군
//     MASK = 10; // 가면군
//     DINOSAUR = 12; // 공룡이
//     PINK_SLIME = 13; // 핑크슬라임
// }

// message CharacterPositionData {
//     int64 id = 1;
//     double x = 2;
//     double y = 3;
// }enum CharacterStateType {
//     NONE_CHARACTER_STATE = 0;
//     BBANG_SHOOTER = 1; // 빵야 시전자
//     BBANG_TARGET = 2; // 빵야 대상 (쉴드 사용가능 상태)
//     DEATH_MATCH_STATE = 3; // 현피 중 자신의 턴이 아닐 때
//     DEATH_MATCH_TURN_STATE = 4; // 현피 중 자신의 턴
//     FLEA_MARKET_TURN = 5; // 플리마켓 자신의 턴
//     FLEA_MARKET_WAIT = 6; // 플리마켓 턴 대기 상태
//     GUERRILLA_SHOOTER = 7; // 게릴라 시전자
//     GUERRILLA_TARGET = 8; // 게릴라 대상
//     BIG_BBANG_SHOOTER = 9; // 난사 시전자
//     BIG_BBANG_TARGET = 10; // 난사 대상
//     ABSORBING = 11; // 흡수 중
//     ABSORB_TARGET = 12; // 흡수 대상
//     HALLUCINATING = 13; // 신기루 중
//     HALLUCINATION_TARGET = 14; // 신기루 대상
//     CONTAINED = 15; // 감금 중
// }

// enum RoleType {
//     NONE_ROLE = 0;
//     TARGET = 1;
//     BODYGUARD = 2;
//     HITMAN = 3;
//     PSYCHOPATH = 4;
// }

// message CharacterStateInfoData {
//     CharacterStateType state = 1;
//     CharacterStateType nextState = 2;
//     int64 nextStateAt = 3; // state가 nextState로 풀리는 밀리초 타임스탬프. state가 NONE이면 0
//     int64 stateTargetUserId = 4; // state에 target이 있을 경우
// }
