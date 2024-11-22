class Observer {
  update(event, data) {
    throw new Error('update method must be implemented by subclass');
  }
}

class Observable {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(event, data) {
    this.observers.forEach((observer) => observer.update(event, data));
  }
}

export { Observer, Observable };
