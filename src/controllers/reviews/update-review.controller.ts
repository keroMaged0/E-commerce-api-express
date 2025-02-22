import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Review } from "../../models/review.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const updateReviewHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  {
    review_rate: number;
    review_comment: string;
  }
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review_rate, review_comment } = req.body;
    const userId = req.loggedUser.user_id;

    const review = await Review.findOne({
      _id: id,
      created_by: userId,
    });
    if (!review)
      return next(new Errors.NotFoundError(ErrorCodes.REVIEW_NOT_FOUND));

    if (review.review_rate) review.review_rate = review_rate;

    if (review.review_comment) review.review_comment = review_comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
