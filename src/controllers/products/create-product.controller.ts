import { RequestHandler } from "express";
import mongoose from "mongoose";

import { IDiscount_type, Product } from "../../models/product.model";
import { uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { logger } from "../../config/winston";
import { env } from "../../config/env";
import { Errors } from "../../errors";
import { Brand } from "../../models/brand.model";

interface productResponseBody {
  name: string;
  description?: string;
  discount_type?: IDiscount_type;
  base_price: number;
  discount?: number;
  stock?: number;
  category_id: mongoose.Types.ObjectId;
  brand_id?: mongoose.Types.ObjectId;
}
export const createProductHandler: RequestHandler<
  unknown,
  SuccessResponse,
  productResponseBody
> = async (req, res, next) => {
  try {
    const {
      name,
      description,
      base_price,
      discount,
      stock,
      category_id,
      brand_id,
      discount_type,
    } = req.body;

    const category = await Category.findById(category_id);
    if (!category)
      return next(new Errors.BadRequest(ErrorCodes.CATEGORY_NOT_FOUND));

    const brand = await Brand.findById(brand_id);
    if (!brand) return next(new Errors.BadRequest(ErrorCodes.BRAND_NOT_FOUND));

    let applied_price: number = base_price;
    if (discount) {
      if (discount > base_price) {
        return next(new Errors.BadRequest(ErrorCodes.INVALID_DISCOUNT));
      }

      if (discount_type) {
        if (discount_type === IDiscount_type.PERCENTAGE) {
          applied_price = base_price - (base_price * discount) / 100;
        } else {
          applied_price = base_price - discount;
        }
      }
      applied_price = base_price - (base_price * discount) / 100;
    }

    let finalImageData: {
      secure_url: string;
      public_id: string;
      folder_id: string;
    }[] = [];
    if (req.files) {
      const files = req.files as Express.Multer.File[];

      for (const file of files) {
        const result = await uploadImageToCloudinary(
          file,
          env.mediaStorage.cloudinary.images.product
        );
        if (!result?.secure_url || !result.public_id) {
          return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));
        }
        finalImageData.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
          folder_id: result.folder_id,
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      base_price,
      discount,
      applied_price,
      stock,
      category_id,
      images: finalImageData,
      created_by: req.loggedUser.user_id,
      brand_id,
    });
    if (!product) return next(new Errors.BadRequest(ErrorCodes.INTERNAL_ERROR));

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
