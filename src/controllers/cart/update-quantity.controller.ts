import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { logger } from "../../config/winston";
import { Cart } from "../../models/cart.model";
import { Errors } from "../../errors";

export const updateQuantityHandler: RequestHandler<
  {
    product_id: string;
  },
  SuccessResponse,
  {
    quantity: number;
  }
> = async (req, res, next) => {
  try {
    const userId = req.loggedUser.user_id;
    const { quantity } = req.body;
    const { product_id } = req.params;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return next(new Errors.BadRequest(ErrorCodes.CART_NOT_FOUND));
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === product_id
    );
    if (productIndex === -1)
      return next(new Errors.BadRequest(ErrorCodes.PRODUCT_NOT_FOUND));

    if (quantity > 0) {
      cart.items[productIndex].quantity = quantity;
    } else {
      cart.items.splice(productIndex, 1);
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: {},
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
