defaultPrice = (originalPrice) => {
  return originalPrice;
};

preOrderPrice = (originalPrice) => {
  return originalPrice * 0.9;
};

promotionPrice = (originalPrice) => {
  return originalPrice * 0.8;
};

blackFridayPrice = (originalPrice) => {
  return originalPrice * 0.6;
};

const getPriceStrategy = {
  default: defaultPrice,
  preOrderPrice,
  promotionPrice,
  blackFridayPrice,
};

function getPrice(originalPrice, typePromotion) {
  return getPriceStrategy[typePromotion](originalPrice);
}

console.log(getPrice(200, "blackFridayPrice"));
