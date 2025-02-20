import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Order } from "../../models/order.model";
import { logger } from "../../config/winston";

export const getOrdersHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user_id: req.loggedUser.user_id,
    }).populate([
      {
        path: "user_id",
        select: "username",
      },
      {
        path: "order_items",
        select: "name base_price applied_price discount discount_type ",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
