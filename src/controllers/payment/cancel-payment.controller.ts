import { RequestHandler } from "express";

import { logger } from "../../config/winston";
import { SuccessResponse } from "../../types/responses.type";
import { Payment, PaymentStatus } from "../../models/payment.model";
import { Errors } from "../../errors";
import { ErrorCodes } from "../../types/errors-code.type";

export const cancelPaymentHandler: RequestHandler<
  {
    id: string;
  },
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

    if (payment.payment_status !== PaymentStatus.PENDING)
      return next(
        new Errors.BadRequest(ErrorCodes.ONLY_PENDING_PAYMENT_CAN_BE_CANCELLED)
      );

    payment.payment_status = PaymentStatus.CANCELLED;
    await payment.save();

    res.json({
      success: true,
      message: "Payment cancelled successfully",
      data: {},
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
