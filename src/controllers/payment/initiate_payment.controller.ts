import { RequestHandler } from "express";

import { Payment, PaymentStatus } from "../../models/payment.model";
import { PaymentGateway } from "../../services/payment.service";
import { Order } from "../../models/order.model";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

interface InitiateResponseBody {
  orderId: string;
  paymentMethod: string;
}

export const initiatePaymentHandler: RequestHandler<
  unknown,
  SuccessResponse,
  InitiateResponseBody
> = async (req, res, next) => {
  const { orderId, paymentMethod } = req.body;
  const { user_id } = req.loggedUser;

  try {
    const order = await Order.findById(orderId);
    if (!order)
      return next(new Errors.NotFoundError(ErrorCodes.ORDER_NOT_FOUND));

    if (order.user_id.toString() !== user_id.toString())
      return next(new Errors.Unauthorized(ErrorCodes.UNAUTHORIZED));

    if (order.is_paid)
      return next(new Errors.BadRequest(ErrorCodes.PAYMENT_ALREADY_DONE));

    const paymentExists = await Payment.findOne({
      order_id: orderId,
      payment_status: PaymentStatus.PENDING,
    });
    if (paymentExists)
      return next(new Errors.BadRequest(ErrorCodes.PAYMENT_ALREADY_INITIATED));

    const amount = order.total_price_after_discount
      ? order.total_price_after_discount
      : order.sub_total;

    const payment = await Payment.create({
      user_id,
      order_id: orderId,
      payment_method: paymentMethod,
      amount,
      payment_status: PaymentStatus.PENDING,
    });

    const paymentSession = await PaymentGateway.createPayment({
      amount,
      paymentId: payment.id,
      userId: user_id,
      productName: `Order #${orderId}`,
    });

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: {
        sessionId: paymentSession.sessionId,
      },
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};
