// 역할 및 캐릭터 분배 셔플 로직
const shuffle = (array) => {
  // 배열의 마지막 인덱스부터 시작하여 첫 번째 요소(인덱스 0)까지 반복
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0에서 i 사이의 무작위 인덱스 생성
    [array[i], array[j]] = [array[j], array[i]]; // 두 요소 위치를 교환
  }
  return array;
};

export default shuffle;
