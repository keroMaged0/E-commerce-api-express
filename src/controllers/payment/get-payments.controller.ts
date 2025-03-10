import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Payment } from "../../models/payment.model";
import { ApiFeature } from "../../utils/api-feature";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const getPaymentsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { user_id } = req.loggedUser;
  try {
    const apiFeatures = new ApiFeature(Payment.find(), req.query);

    const payments = await apiFeatures.query.populate("order_id");
    if (!payments)
      return next(new Errors.NotFoundError(ErrorCodes.PAYMENT_NOT_FOUND));

    res.json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
