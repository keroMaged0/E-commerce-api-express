import { RequestHandler } from "express";
import { DateTime } from "luxon";

import { Coupon, DiscountType } from "../../models/coupon.model";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Crypto } from "../../utils/crypto.utils";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

interface CouponResponseBody {
  discount_type?: DiscountType;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  start_date: string;
  expiry_date: string;
}

export const addCouponHandler: RequestHandler<
  unknown,
  SuccessResponse,
  CouponResponseBody
> = async (req, res, next) => {
  try {
    const {
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      usage_limit,
      start_date,
      expiry_date,
    } = req.body;
    const userId = req.loggedUser.user_id;

    const code = Crypto.generateCode(3).toUpperCase();

    const startDateTime = DateTime.fromISO(start_date);
    const expiryDateTime = DateTime.fromISO(expiry_date);
    const now = DateTime.now();

    if (startDateTime.invalidReason || expiryDateTime.invalidReason) {
      return next(new Errors.BadRequest(ErrorCodes.INVALID_DATE_FORMAT));
    }

    if (startDateTime < now) {
      return next(new Errors.BadRequest(ErrorCodes.START_DATE_IN_PAST));
    }

    if (expiryDateTime <= startDateTime) {
      return next(new Errors.BadRequest(ErrorCodes.EXPIRY_DATE_BEFORE_START));
    }

    const coupon = await Coupon.create({
      code,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      usage_limit,
      start_date,
      expiry_date,
      created_by: userId,
    });

    res.json({
      success: true,
      message: "Coupon added successfully",
      data: coupon,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
