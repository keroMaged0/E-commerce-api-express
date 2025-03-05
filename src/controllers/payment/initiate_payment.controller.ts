import { RequestHandler } from "express";

import { PaymentGateway } from "../../services/payment.service";
import { Order, OrderStatus } from "../../models/order.model";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Payment } from "../../models/payment.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

interface initiateResponseBody {
  orderId: string;
  paymentMethod: string;
}

export const initiatePaymentHandler: RequestHandler<
  unknown,
  SuccessResponse,
  initiateResponseBody
> = async (req, res, next) => {
  const { orderId, paymentMethod } = req.body;
  const { user_id } = req.loggedUser;

  try {
    // get order by id
    const order = await Order.findById(orderId);
    if (!order)
      return next(new Errors.NotFoundError(ErrorCodes.ORDER_NOT_FOUND));

    // check if order belongs to the user
    if (order.user_id.toString() !== user_id.toString())
      return next(new Errors.Unauthorized(ErrorCodes.UNAUTHORIZED));

    // check if order is pending
    if (order.order_status !== OrderStatus.PENDING)
      return next(new Errors.BadRequest(ErrorCodes.PAYMENT_ALREADY_DONE));

    // create payment
    const payment = await Payment.create({
      user_id,
      order_id: orderId,
      payment_method: paymentMethod,
      amount: order.total_price_after_discount,
    });

    const paymentSession = await PaymentGateway.createPayment({
      amount: order.total_price_after_discount,
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
