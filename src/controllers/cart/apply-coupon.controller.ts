import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Coupon } from "../../models/coupon.model";
import { Cart } from "../../models/cart.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const applyCouponHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {
    coupon_code: string;
  }
> = async (req, res, next) => {
  const { coupon_code } = req.body;
  const { user_id } = req.loggedUser;
  try {
    const coupon = await Coupon.findOne({
      code: coupon_code,
      status: true,
      is_deleted: false,
      start_date: { $lte: new Date() },
      expiry_date: { $gte: new Date() },
      users_used: { $ne: user_id },
      usage_limit: { $gt: 0 },
    });
    if (!coupon)
      return next(new Errors.NotFoundError(ErrorCodes.COUPON_NOT_FOUND));

    const cart = await Cart.findOne({ user_id });
    if (!cart) return next(new Errors.BadRequest(ErrorCodes.CART_NOT_FOUND));

    if (coupon.min_purchase_amount > cart.sub_total)
      return next(new Errors.BadRequest(ErrorCodes.INVALID_COUPON));

    coupon.usage_limit -= 1;
    coupon.users_used.push(user_id as any);
    await coupon.save();

    cart.discount_code = coupon_code;
    await cart.save();

    res.json({
      success: true,
      message: "Coupon applied successfully",
      data: {},
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
