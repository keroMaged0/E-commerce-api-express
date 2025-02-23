import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Coupon } from "../../models/coupon.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const deleteCouponHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.loggedUser;

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, created_by: user_id },
      {
        is_deleted: true,
      }
    );
    if (!coupon)
      return next(new Errors.NotFoundError(ErrorCodes.COUPON_NOT_FOUND));

    res.json({
      success: true,
      message: "Coupon deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
