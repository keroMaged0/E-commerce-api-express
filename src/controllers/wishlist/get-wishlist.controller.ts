import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Wishlist } from "../../models/wishlist.model";
import { ApiFeature } from "../../utils/api-feature";
import { logger } from "../../config/winston";

export const getwishlistHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { user_id } = req.loggedUser;
  try {
    const apiFeatures = new ApiFeature(Wishlist.find({ user_id }), req.query)
      .paginate()
      .search();

    const wishlist = await apiFeatures.query.populate("products");

    res.json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
