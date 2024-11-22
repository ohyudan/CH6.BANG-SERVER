import CardData from '../model/card/cardData.class.js';
import { getGameAssets } from '../init/loadGameAssets.js';
// 카드의 타입과 개수를 정의
const loadCardInit = () => {
  const cardDeck = [];

  const gameAsset = getGameAssets();
  const cardDeckSetting = gameAsset.cardDeck.cardDeck;
  cardDeckSetting.forEach((element) => {
    for (let i = 0; i < element.count; i++) {
      cardDeck.push(new CardData(element.type));
    }
  });

  return cardDeck;
  //이를 기반으로 cardDeck(실제 카드 덱)을 생성
  //cardDeck = cardTypes.flatMap(({ type, count }) => new Array(count).fill(type));
};
export default loadCardInit;
