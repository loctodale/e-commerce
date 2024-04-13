class Leader {
  receiveRequest(offer) {
    console.log(`result ${offer}`);
  }
}

class Secretary {
  constructor() {
    this.leader = new Leader();
  }

  receiveRequest(offer) {
    this.leader.receiveRequest(offer);
  }
}

class Dev {
  constructor(offer) {
    this.offer = offer;
  }

  applyFor(target) {
    target.receiveRequest(this.offer);
  }
}

const devs = new Dev("50");
devs.applyFor(new Secretary());
