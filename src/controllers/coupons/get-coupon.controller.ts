import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Coupon } from "../../models/coupon.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const getCouponByIdHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      created_by: req.loggedUser.user_id,
    });
    if (!coupon)
      return next(new Errors.BadRequest(ErrorCodes.COUPON_NOT_FOUND));

    res.status(200).json({
      success: true,
      message: "Coupon retrieved successfully",
      data: coupon,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
