const fs = require("fs");
class Discount {
  calc(value) {
    return value * 0.9;
  }
}

class Shipping {
  calc() {
    return 5;
  }
}

class Fee {
  calc(value) {
    return value * 1.05;
  }
}

class ShopeeFacadePattern {
  constructor() {
    this.discount = new Discount();
    this.shipping = new Shipping();
    this.fee = new Fee();
  }
  calc(price) {
    price = this.discount.calc(price);
    price = this.fee.calc(price);
    price += this.shipping.calc();

    return price;
  }
}

function buy(price) {
  const shopee = new ShopeeFacadePattern();
  console.log(`price:: `, shopee.calc(price));
}

const file = fs.readFileSync("../../keys/public_key.pem");
console.log(file.toString());
buy(120000);
