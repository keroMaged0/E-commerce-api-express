import { RequestHandler } from "express";

import {
  IShippingAddress,
  Order,
  OrderStatus,
  PaymentMethod,
} from "../../models/order.model";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const updateOrderHandler: RequestHandler<
  {
    order_id: string;
  },
  SuccessResponse,
  {
    order_status?: OrderStatus;
    payment_method?: PaymentMethod;
    shipping_address?: IShippingAddress;
    coupon_id?: string;
  }
> = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { order_status, payment_method, shipping_address, coupon_id } =
      req.body;

    const order = await Order.findOne({
      _id: order_id,
      user_id: req.loggedUser.user_id,
      order_status: { $ne: OrderStatus.CANCELLED },
    });
    if (!order)
      return next(new Errors.NotFoundError(ErrorCodes.ORDER_NOT_FOUND));

    if (order_status) order.order_status = order_status;

    if (payment_method) order.payment_method = payment_method;

    if (shipping_address) order.shipping_address = shipping_address;

    if (coupon_id) {
      //:TODO: check if coupon is valid
    }

    await order.save();

    res.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
