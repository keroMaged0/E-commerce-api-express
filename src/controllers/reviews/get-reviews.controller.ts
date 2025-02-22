import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Review } from "../../models/review.model";
import { logger } from "../../config/winston";

export const getReviewsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {}
> = async (req, res, next) => {
  try {
    const review = await Review.find().populate([
      {
        path: "product_id",
        select: "name",
      },
      
      {
        path: "user_id",
        select: "name",
      },
    ]);
    res.json({
      success: true,
      message: "Reviews fetched successfully",
      data: review,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
