const { getUnSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

class DiscountRepository {
  async findDiscount({ discount_code, discount_shopId }) {
    return await discountModel
      .findOne({
        discount_code,
        discount_shopId,
      })
      .lean();
  }

  async findAllDiscountCodeUnselect({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    unSelect,
    model,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const documents = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getUnSelectData(unSelect))
      .lean();

    return documents;
  }

  async findAllDiscountCodeSelect({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    select,
    model,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const documents = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();

    return documents;
  }

  async findByIdAndUpdate({ discount_id, userId }) {
    return await discountModel.findByIdAndUpdate(id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports = new DiscountRepository();
