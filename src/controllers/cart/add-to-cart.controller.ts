import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Product } from "../../models/product.model";
import { Cart } from "../../models/cart.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

interface cartResponseBody {
  productId: string;
  quantity: number;
}

export const addToCartHandler: RequestHandler<
  unknown,
  SuccessResponse,
  cartResponseBody
> = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.loggedUser.user_id;

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = await Cart.create({
        user_id: userId,
        items: [],
      });
    }

    const product = await Product.findById(productId);
    if (!product)
      return next(new Errors.BadRequest(ErrorCodes.PRODUCT_NOT_FOUND));

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId as any,
        quantity,
        price: product.applied_price,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
