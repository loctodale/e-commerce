const { SuccessReponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessReponse({
      message: "Add to inventory successfully",
      metaData: await InventoryService.addStockToInventory({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}
module.exports = new InventoryController();
