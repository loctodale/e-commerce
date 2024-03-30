const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const discountRepo = require("../models/repositories/discount.repo");
const productRepo = require("../models/repositories/product.repo");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    if (
      !(new Date() < new Date(start_date)) ||
      !(new Date(end_date) > new Date())
    ) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    const foundDiscount = await discountRepo.findDiscount({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (foundDiscount && foundDiscount.is_active) {
      throw new BadRequestError("Discount code already existed");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_max_uses: max_uses,
      discount_code: code,
      discount_min_order_value: min_order_value || 0,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_is_active: is_active,
      discount_uses_per_user: max_uses_per_user,
      discount_uses_count: uses_count,
      discount_shopId: shopId,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static getAllProductsWithDiscountCode = async ({
    userId,
    shopId,
    code,
    page,
    limit,
  }) => {
    const foundDiscount = await discountRepo.findDiscount({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount || foundDiscount.discount_is_active === false) {
      throw new NotFoundError("Discount not exist");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = productRepo.findAllProduct({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = productRepo.findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  };

  static getAllDiscountCodeByShop = async ({ limit, page, shopId }) => {
    const discounts = await discountRepo.findAllDiscountCodeUnselect({
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      unSelect: ["__v"],
      model: discountModel,
    });
    return discounts;
  };

  static getDiscountAmount = async ({ code, userId, shopId, products }) => {
    const foundDiscount = await discountRepo.findDiscount({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount) throw new NotFoundError("discount not found");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_type,
      discount_value,
      discount_max_uses_per_user,
      discount_min_order_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("discount expired");
    if (!discount_max_uses) throw new NotFoundError("discount are out");

    if (
      !(new Date() < new Date(discount_start_date)) ||
      !(new Date() < new Date(discount_end_date))
    ) {
      throw new NotFoundError("discount expired");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount min order value ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsesDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUsesDiscount) {
        if (userUsesDiscount.length() >= discount_max_uses_per_user) {
          throw new NotFoundError(`This is used by this user`);
        }
      }
    }
    const amount =
      discount_type === "fix-amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  };

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId,
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await discountRepo.findDiscount({
      discount_code: codeId,
      discount_shopId: shopId,
    });
    if (!foundDiscount) {
      throw new NotFoundError(`discount does not exist`);
    }

    const result = await discountRepo.findByIdAndUpdate({
      discount_id: foundDiscount._id,
      userId,
    });

    return result;
  }
}

module.exports = DiscountService;
