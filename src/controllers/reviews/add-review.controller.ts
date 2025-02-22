import { RequestHandler } from "express";

import { Order, OrderStatus } from "../../models/order.model";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Review } from "../../models/review.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const addReviewHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {
    review_rate: number;
    review_comment?: string;
    product_id: string;
    order_id: string;
  }
> = async (req, res, next) => {
  try {
    const { review_rate, review_comment, product_id, order_id } = req.body;
    const userId = req.loggedUser.user_id;

    const order = await Order.findOne({
      _id: order_id,
      user_id: userId,
      order_items: product_id,
      order_status: OrderStatus.COMPLETED,
    });
    if (!order)
      return next(new Errors.BadRequest(ErrorCodes.PRODUCT_NOT_ORDERED));
    ``;

    const reviewExists = await Review.findOne({
      user_id: userId,
      product_id,
    });
    if (reviewExists)
      return next(new Errors.BadRequest(ErrorCodes.REVIEW_ALREADY_EXISTS));

    const review = await Review.create({
      review_rate,
      review_comment,
      user_id: userId,
      created_by: userId,
      product_id,
      order_id,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
