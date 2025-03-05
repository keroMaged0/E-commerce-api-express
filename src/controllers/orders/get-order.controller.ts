import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Order } from "../../models/order.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const getOrderByIdHandler: RequestHandler<
  {
    order_id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const userId = req.loggedUser.user_id;

    const order = await Order.findOne({
      _id: order_id,
      user_id: userId,
    }).select("order_items total_price_after_discount createdAt status");

    if (!order) return next(new Errors.BadRequest(ErrorCodes.ORDER_NOT_FOUND));

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
