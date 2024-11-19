import { failCodeReturn } from '../../utils/response/createResponse.js';

export const useCardHandler = ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;
  let failCode = failCodeReturn(0);

  //   CardType {
  //     NONE = 0;
  //     BBANG = 1; // 20장
  //     BIG_BBANG = 2; // 1장
  //     SHIELD = 3; // 10장
  //     VACCINE = 4; // 6장
  //     CALL_119 = 5; // 2장
  //     DEATH_MATCH = 6; // 4장
  //     GUERRILLA = 7; // 1장
  //     ABSORB = 8; // 4장
  //     HALLUCINATION = 9; // 4장
  //     FLEA_MARKET = 10; // 3장
  //     MATURED_SAVINGS = 11; // 2장
  //     WIN_LOTTERY = 12; // 1장
  //     SNIPER_GUN = 13; // 1장 //
  //     HAND_GUN = 14; // 2장
  //     DESERT_EAGLE = 15; // 3장
  //     AUTO_RIFLE = 16; // 2장 //
  //     LASER_POINTER = 17; // 1장
  //     RADAR = 18; // 1장
  //     AUTO_SHIELD = 19; // 2장
  //     STEALTH_SUIT = 20; // 2장
  //     CONTAINMENT_UNIT = 21; // 3장
  //     SATELLITE_TARGET = 22; // 1장
  //     BOMB = 23; // 1장
  // }
  try {
    // cardType에 따라 다른 로직 적용
    // 1 (빵야)
    // 2 (무차별난사)
    // 4 (백신)
    if (cardType === 4)
    // 5 (119호출)
    // 6 (현피)
    // 7 (게릴라전)
    // 11 (만기적금)
    // 12 (로또당첨)
    // 13,14,15,16 (무기)
    // 17,18,19,20 (장비)
    // 21,22,23 (디버프)
    // 3 (쉴드) - 
    // 8(흡수),9(신기루) 미구현
    // 10(플리마켓) 미구현
    // 해당 핸들러에서는 CharaterStateType만 지정하고 전투 처리는 캐릭터 정보 업데이트에서 한번 더 처리하는게 좋을거 같다.
  } catch (error) {}
};
