import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { logger } from "../../config/winston";
import { Review } from "../../models/review.model";
import { Errors } from "../../errors";
import { ErrorCodes } from "../../types/errors-code.type";

export const getReviewByIdHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id).populate([
      {
        path: "product_id",
        select: "name",
      },
      {
        path: "user_id",
        select: "name",
      },
    ]);
    if (!review)
      return next(new Errors.NotFoundError(ErrorCodes.REVIEW_NOT_FOUND));

    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
