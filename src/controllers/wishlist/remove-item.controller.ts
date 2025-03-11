import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Wishlist } from "../../models/wishlist.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const removeItemFromWishlistHandler: RequestHandler<
  {
    product_id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { product_id } = req.params;
  const { user_id } = req.loggedUser;
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user_id, products: product_id },
      { $pull: { products: product_id } },
      { new: true }
    );
    if (!wishlist)
      return next(new Errors.NotFoundError(ErrorCodes.WISHLIST_NOT_FOUND));

    res.json({
      success: true,
      message: "Item removed from wishlist successfully",
      data: {},
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
