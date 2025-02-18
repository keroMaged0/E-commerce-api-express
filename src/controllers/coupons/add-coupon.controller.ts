import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";

import { logger } from "../../config/winston";
import { Product } from "../../models/product.model";
import { Errors } from "../../errors";
import { ErrorCodes } from "../../types/errors-code.type";
import { User } from "../../models/user.model";
import { Review } from "../../models/review.model";

export const addCouponHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {
    review_rate: number;
    review_comment: string;
    product_id: string;
  }
> = async (req, res, next) => {
  try {
    const { review_rate, review_comment, product_id } = req.body;
    const user_id = req.loggedUser.user_id;

    const product = await Product.findById(product_id);
    if (!product)
      return next(new Errors.BadRequest(ErrorCodes.PRODUCT_NOT_FOUND));

    const user = await User.findById(user_id);
    if (!user) return next(new Errors.BadRequest(ErrorCodes.USER_NOT_FOUND));

    //:TODO: check if user has already reviewed the product

    //:TODO: update product average rating and total reviews

    const review = await Review.create({
      review_rate,
      review_comment,
      user_id,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
