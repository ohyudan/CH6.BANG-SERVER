// 카드 분배용 로직(doubleLinkedList)
class Node {
  constructor(item) {
    this.item = item;
    this.prev = null;
    this.next = null;
  }
}

class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  prepend(item) {
    const node = new Node(item);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.size++;
  }

  append(item) {
    const node = new Node(item);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
  }

  insert(item, index) {
    if (index < 0 || index > this.size) {
      console.log('Invalid index');
      return;
    }

    if (index === 0) {
      this.prepend(item);
      return;
    }

    if (index === this.size) {
      this.append(item);
      return;
    }

    const node = new Node(item);
    let curr = this.getNode(index);
    node.next = curr;
    node.prev = curr.prev;
    curr.prev.next = node;
    curr.prev = node;

    this.size++;
  }

  removeFront() {
    if (this.isEmpty()) {
      return null;
    }

    const item = this.head.item;
    this.head = this.head.next;
    this.size--;

    return item;
  }

  removeEnd() {
    if (this.isEmpty()) {
      return null;
    }

    const item = this.tail.item;
    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }
    this.size--;

    return item;
  }

  remove(index) {
    if (this.isEmpty() || index < 0 || index >= this.size) {
      return null;
    }

    if (index === 0) {
      return this.removeFront();
    }

    if (index === this.size - 1) {
      return this.removeEnd();
    }

    let node = this.getNode(index);
    const prev = node.prev;
    node.prev.next = node.next;
    node.next.prev = prev;
    this.size--;

    return node.item;
  }

  removeItem(item) {
    if (this.isEmpty()) {
      return null;
    }

    let index = this.searchIndex(item);
    if (index === -1) {
      console.log('item not found');
      return null;
    }

    this.remove(index);
  }

  searchIndex(item) {
    if (this.isEmpty()) {
      return -1;
    }

    let index = 0;
    let curr = this.head;
    while (curr !== null && curr.item !== item) {
      curr = curr.next;
      index++;
    }

    if (!curr) {
      index = -1;
    }

    return index;
  }

  getNode(index) {
    if (this.isEmpty() || index > this.size || index < 0) {
      return null;
    }

    let curr = this.head;
    for (let i = 0; i < index; i++) {
      curr = curr.next;
    }

    return curr;
  }

  print() {
    if (this.isEmpty()) {
      console.log('empty');
      return;
    }

    let curr = this.head;
    let result = '';
    while (curr) {
      result += `${curr.item} `;
      curr = curr.next;
    }

    console.log(result);
  }
}

export default DoubleLinkedList;
