import { RequestHandler } from "express";

import {
  IShippingAddress,
  Order,
  PaymentMethod,
} from "../../models/order.model";
import { SuccessResponse } from "../../types/responses.type";
import { Product } from "../../models/product.model";
import { Cart } from "../../models/cart.model";
import { logger } from "../../config/winston";

interface OrderResponseBody {
  shipping_address: IShippingAddress;
  payment_method: PaymentMethod;
}

export const addOrderHandler: RequestHandler<
  unknown,
  SuccessResponse,
  OrderResponseBody
> = async (req, res, next) => {
  const { shipping_address, payment_method } = req.body;
  const userId = req.loggedUser.user_id;

  try {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart?.items.length) {
      res.status(400).json({
        success: false,
        message: "Cart is empty",
        data: {},
      });
      return;
    }

    let totalOrderPrice = cart.total_price_after_discount
      ? cart.total_price_after_discount
      : cart.sub_total;

    const order = new Order({
      order_items: cart.items,
      user_id: userId,
      shipping_address,
      payment_method,
      sub_total: cart.sub_total,
      total_price_after_discount: totalOrderPrice,
    });

    if (order) {
      let options = cart.items.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.quantity } },
        },
      }));

      await Product.bulkWrite(options);
      await order.save();
    }

    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      success: true,
      message: "Order added successfully",
      data: order,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
