import { RequestHandler } from "express";
import { DateTime } from "luxon";

import { SuccessResponse } from "../../types/responses.type";
import { Coupon, DiscountType } from "../../models/coupon.model";
import { ErrorCodes } from "../../types/errors-code.type";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

interface ResponseBody {
  discount_type?: DiscountType;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  discount_value?: number;
  usage_limit?: number;
  expiry_date?: string;
  start_date?: string;
}

export const updateCouponHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  ResponseBody
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.loggedUser;
    const {
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      usage_limit,
      start_date,
      expiry_date,
    } = req.body;

    const coupon = await Coupon.findOne({ _id: id, created_by: user_id });
    if (!coupon)
      return next(new Errors.BadRequest(ErrorCodes.COUPON_NOT_FOUND));

    if (discount_type) coupon.discount_type = discount_type;

    if (discount_value) coupon.discount_value = discount_value;

    if (min_purchase_amount) coupon.min_purchase_amount = min_purchase_amount;

    if (max_discount_amount) coupon.max_discount_amount = max_discount_amount;

    if (usage_limit) coupon.usage_limit = usage_limit;

    if (start_date) {
      const startDateTime = DateTime.fromISO(start_date);
      if (!startDateTime.isValid) {
        return next(new Errors.BadRequest(ErrorCodes.INVALID_DATE_FORMAT));
      }
      if (startDateTime < DateTime.now()) {
        return next(new Errors.BadRequest(ErrorCodes.START_DATE_IN_PAST));
      }
      coupon.start_date = startDateTime.toJSDate();
    }

    if (expiry_date) {
      const expiryDateTime = DateTime.fromISO(expiry_date);
      if (!expiryDateTime.isValid) {
        return next(new Errors.BadRequest(ErrorCodes.INVALID_DATE_FORMAT));
      }
      if (
        coupon.start_date &&
        expiryDateTime <= DateTime.fromJSDate(coupon.start_date)
      ) {
        return next(new Errors.BadRequest(ErrorCodes.EXPIRY_DATE_BEFORE_START));
      }
      coupon.expiry_date = expiryDateTime.toJSDate();
    }

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
