import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Review } from "../../models/review.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const deleteReviewHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.loggedUser.user_id;

    const review = await Review.findOne({
      _id: id,
      created_by: userId,
    });
    if (!review)
      return next(new Errors.NotFoundError(ErrorCodes.REVIEW_NOT_FOUND));

    review.is_deleted = true;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: {},
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
