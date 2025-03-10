import { RequestHandler } from "express";

import { logger } from "../../config/winston";
import { SuccessResponse } from "../../types/responses.type";
import { Payment } from "../../models/payment.model";
import { Errors } from "../../errors";
import { ErrorCodes } from "../../types/errors-code.type";

export const getPaymentByIdHandler: RequestHandler<
  { id: string },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.loggedUser;
  try {
    const payment = await Payment.findOne({
      _id: id,
      user_id,
    });
    if (!payment)
      return next(new Errors.NotFoundError(ErrorCodes.PAYMENT_NOT_FOUND));

    res.json({
      success: true,
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
