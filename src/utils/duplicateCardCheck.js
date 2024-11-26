/**
 * 카드 데이터를 변환
 * @param {Array} data - 카드 데이터 배열
 * @returns {Array} - { type, count } 형태로 변환된 데이터
 * [{ type: 'A', count: 2 }]
 */
export const transformData = (data) => {
    const typeCountMap = new Map();
  
    data.forEach((card) => {
      const type=card.type;
      typeCountMap.set(type, (typeCountMap.get(type) || 0) + 1);
    });
    //console.log(Array.from(typeCountMap, ([type, count]) => ({ type, count })));
    return Array.from(typeCountMap, ([type, count]) => ({ type, count }));
  };