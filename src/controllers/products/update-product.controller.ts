import { RequestHandler } from "express";

import { IDiscount_type, Product } from "../../models/product.model";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { updateImage } from "../../utils/upload-media";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const updateProductHandler: RequestHandler<
  { id: string },
  SuccessResponse,
  {
    name?: string;
    description?: string;
    base_price?: number;
    discount?: number;
    discount_type?: string;
    stock?: number;
    oldPublicId?: string;
  }
> = async (req, res, next) => {
  const {
    name,
    description,
    base_price,
    discount,
    discount_type,
    stock,
    oldPublicId,
  } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product)
    return next(new Errors.NotFoundError(ErrorCodes.PRODUCT_NOT_FOUND));

  if (product.created_by.toString() !== req.loggedUser.user_id.toString())
    return next(new Errors.BadRequest(ErrorCodes.NOT_ALLOWED));

  if (name) product.name = name;

  if (description) product.description = description;

  if (stock) {
    product.stock = stock;
    if (stock === 0) product.is_available = false;
  }

  if (base_price !== undefined || discount !== undefined) {
    if (discount_type !== undefined) {
      product.discount_type = discount_type as IDiscount_type;
    }
    if (base_price !== undefined) {
      product.base_price = base_price;
    }
    const newDiscount = discount !== undefined ? discount : product.discount;
    if (newDiscount !== undefined) {
      if (product.discount_type === IDiscount_type.FIXED) {
        if (newDiscount > product.base_price) {
          return next(new Errors.BadRequest(ErrorCodes.INVALID_DISCOUNT));
        }
        product.applied_price = product.base_price - newDiscount;
      } else {
        if (newDiscount < 0 || newDiscount > 100) {
          return next(new Errors.BadRequest(ErrorCodes.INVALID_DISCOUNT));
        }
        product.applied_price =
          product.base_price - (product.base_price * newDiscount) / 100;
      }
      product.discount = newDiscount;
    } else {
      product.applied_price = product.base_price;
    }
  }

  if (oldPublicId && product.images) {
    if (!req.file)
      return next(new Errors.BadRequest(ErrorCodes.IMAGE_NOT_FOUND));
    const matchOld = product.images.find(
      (img) => img.public_id === oldPublicId
    );
    if (!matchOld)
      return next(new Errors.BadRequest(ErrorCodes.IMAGE_NOT_FOUND));

    const folderId = matchOld.folder_id;
    const file = req.file as Express.Multer.File;

    const result = await updateImage(oldPublicId, folderId, file);
    if (!result)
      return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

    const index = product.images.findIndex(
      (img) => img.public_id === oldPublicId
    );

    if (index !== -1) {
      product.images[index].secure_url = result;
    }
  }

  await product.save();

  res.json({
    message: "Product updated successfully",
    success: true,
    data: product,
  });

  try {
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
