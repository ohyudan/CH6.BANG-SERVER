class DataQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(data) {
    this.queue.push(data);
  }

  dequeue() {
    return this.queue.shift();
  }
  peek() {
    return this.queue.length > 0 ? this.queue[0] : null;
  }
  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }

  clear() {
    this.queue = null;
    console.log('큐가 비워졌습니다.');
  }
}

export default DataQueue;
