import { RequestHandler } from "express";

import { cloudinaryConnection } from "../../config/cloudinary.config";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Product } from "../../models/product.model";
import { Errors } from "../../errors";

export const deleteProductHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const userId = req.loggedUser.user_id;
  const { id } = req.params;

  const product = await Product.findOne({
    _id: id,
    created_by: userId,
    is_deleted: false,
  });
  if (!product)
    return next(new Errors.BadRequest(ErrorCodes.PRODUCT_NOT_FOUND));

  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images.map(async (image: { public_id: string }) => {
        await cloudinaryConnection().uploader.destroy(image.public_id);
      })
    );
  }

  await Product.updateOne({ _id: id }, { is_deleted: true });

  res.json({
    success: true,
    message: "Product deleted successfully",
    data: {},
  });
};
