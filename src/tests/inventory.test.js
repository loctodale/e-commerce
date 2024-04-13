const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_event", (channel, message) => {
      console.log("Recive message:" + message);
      InventoryServiceTest.updateInventory(message);
    });
  }

  static updateInventory(productId, quantity) {
    console.log(
      "update inventory for productId:" + productId + " Quantity:" + quantity
    );
  }
}

module.exports = new InventoryServiceTest();
