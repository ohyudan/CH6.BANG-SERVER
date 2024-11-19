import { getProtoMessages } from '../../init/loadProtos.js';

const useCardHandler = ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;

//   const user = getUserBySocket(socket);
//   const targetUser = getUserById(targetUserId);

  // 카드 타입이 번호로 올것 enum 파일 사용한 뒤 그 값에 따라 switch 분기
  switch (cardType) {
    case 1: {
        // 1. 수중에 Bang 카드가 존재하는가? - 없으면 진행x
        // user.character.handCards.? 유저의 보유 카드 데이터 접근방법 필요
        // 2. 뱅을 시전했는데 타겟 유저가 없는 경우 = 진행x
        if(!targetUser) {
            //Response 패킷 발송
        }
        // 3. 뱅을 사용에 성공 / 사용자의 뱅 사용 카운트 감소
        // user.character.bbangCount -= 1;


        // 4. 타겟 유저가 개굴맨 직업인지 / 개굴맨이면 공격을 25% 확률로 무효
        if (targetUser.character.characterType === 7) {
            // 25퍼 확률 계산하고 통과 시 뱅 종료
        }

        // 4-1. 타겟 유저가 자동 쉴드를 가지고 있는지 / 있으면 자동 쉴드 확률(25%) 로 데미지 무효
        // 4-2. 타겟 유저가 공격 무효 성공 / 체력 감소 x 뱅 종료

        // 5. 공격자의 캐릭터가 상어군 or 장비 중 레이저 포인터가 있는지 / 하나라도 있으면 방어에 쉴드 2개 필요
        
        // 5-1. 타겟 유저가 쉴드 카드 1or2장이 있는지, 쉴드 사용 유무 확인
        // if (targetUser.character.handCards.? 보유한 쉴드 카드 확인)
        // 쉴드 사용 유무 확인 방법?
        // 타겟 유저의 CharacterStateType을 2로 변경시키고 notification을 배포?
        // targetUser.character.stateInfo.? nextState ?
        
        // 5-3. 타겟 유저가 필요한 만큼 쉴드를 사용하면 방어 성공 / 체력 감소 x 뱅 종료

        // 6. 공격자가 장비 D이글을 장착 중이면 / 대상 체력 2 감소 평상시엔 1 감소

        // 7. 타겟 유저가 체력이 0이 되어 사망했는가?

        // 7-1. 플레이어 중 가면군이 있으면 그 사람에게 사망한 타겟 유저의 카드를 넘김

        // 7-2. 가면군이 없으면 사망한 타겟 유저의 카드는 덱으로 반환

        // 8. 타겟 유저가 사망하지 않은 상태이고 캐릭터가 말랑이or핑크슬라임인가?

        // 8-1. 말랑이 -> 감소한 체력만큼 덱에서 카드 획득 / 슬라임 -> 공격자의 핸드에서 무작위 카드 한장을 가져감

        // 9. 뱅 종료

      break;
    }
    case 2: {
      break;
    }
  }
};

export default useCardHandler;
