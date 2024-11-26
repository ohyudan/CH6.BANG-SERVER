import CardData from '../model/card/cardData.class.js';
import { getGameAssets } from '../init/loadGameAssets.js';
import DoubleLinkedList from './doubleLinkedList.js';
import shuffle from 'lodash/shuffle.js';

// 카드의 타입과 개수를 정의
const loadCardInit = async () => {
  let cardDeckArr = [];

  const gameAsset = getGameAssets();
  const cardDeckSetting = gameAsset.cardDeck.cardDeck;

  cardDeckSetting.forEach((element) => {
    for (let i = 0; i < element.count; i++) {
      cardDeckArr.push(new CardData(element.type));
    }
  });

  const cardDeck = new DoubleLinkedList();
  cardDeckArr = shuffle(cardDeckArr);

  cardDeckArr.forEach((card) => {
    cardDeck.append(card); // 덱에 카드 추가
  });
  return cardDeck;
  //이를 기반으로 cardDeck(실제 카드 덱)을 생성
  //cardDeck = cardTypes.flatMap(({ type, count }) => new Array(count).fill(type));
};
export default loadCardInit;
