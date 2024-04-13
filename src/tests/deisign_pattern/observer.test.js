class Observer {
  constructor(name) {
    this.pickname = name;
  }
  updateStatus(location) {
    this.goToHelp(location);
  }

  goToHelp(location) {
    console.log(`${this.pickname}:::: PING ::::${location}`);
  }
}

class Subject {
  constructor() {
    this.observerList = [];
  }

  addObserver(observer) {
    this.observerList.push(observer);
  }

  notify(location) {
    this.observerList.forEach((observer) => observer.updateStatus(location));
  }
}

const observer = new Observer();
const subject = new Subject();

const player1 = new Observer("player1");
const player2 = new Observer("player2");
subject.addObserver(player1);
subject.addObserver(player2);

subject.notify(`{location: 123456777}`);
