import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Wishlist } from "../../models/wishlist.model";
import { logger } from "../../config/winston";
import { Product } from "../../models/product.model";
import { ErrorCodes } from "../../types/errors-code.type";
import { Errors } from "../../errors";

export const addToWishlistHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {
    product_id: string;
  }
> = async (req, res, next) => {
  const { product_id } = req.body;
  const { user_id } = req.loggedUser;
  try {
    const product = await Product.findById(product_id);
    if (!product)
      return next(new Errors.NotFoundError(ErrorCodes.PRODUCT_NOT_FOUND));

    let wishlist = await Wishlist.findOne({ user_id });
    if (!wishlist) {
      wishlist = new Wishlist({ user_id, products: [product_id] });
    } else {
      if (!wishlist.products.includes(product_id as any)) {
        wishlist.products.push(product_id as any);
      } else {
        return next(
          new Errors.BadRequest(ErrorCodes.PRODUCT_ALREADY_IN_WISHLIST)
        );
      }
    }
    await wishlist.save();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
