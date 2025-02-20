import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Order, OrderStatus } from "../../models/order.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const cancelOrderHandler: RequestHandler<
  {
    order_id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { order_id } = req.params;
  const userId = req.loggedUser.user_id;

  try {
    const order = await Order.findOne({
      _id: order_id,
      user_id: userId,
      order_status: OrderStatus.PENDING,
    });
    if (!order) return next(new Errors.BadRequest(ErrorCodes.ORDER_NOT_FOUND));

    order.order_status = OrderStatus.CANCELLED;
    order.cancelled_at = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {},
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
