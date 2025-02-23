import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";

import { logger } from "../../config/winston";
import { Coupon } from "../../models/coupon.model";

export const getCouponsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      created_by: req.loggedUser.user_id,
    });

    res.json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
