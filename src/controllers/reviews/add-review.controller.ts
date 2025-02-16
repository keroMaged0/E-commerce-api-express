import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";

import { logger } from "../../config/winston";
import { Product } from "../../models/product.model";
import { Errors } from "../../errors";
import { ErrorCodes } from "../../types/errors-code.type";
import { User } from "../../models/user.model";

export const addReviewHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {
    review_rate: number;
    review_comment: string;
    product_id: string;
  }
> = async (req, res, next) => {
  try {
    
  } catch (error) {
    next();
    logger.error(error);
  }
};
