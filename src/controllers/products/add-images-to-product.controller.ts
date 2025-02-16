import { RequestHandler } from "express";

import { uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Product } from "../../models/product.model";
import { logger } from "../../config/winston";
import { env } from "../../config/env";
import { Errors } from "../../errors";

export const addImagesToProductHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new Errors.NotFoundError(ErrorCodes.PRODUCT_NOT_FOUND));

  if (!req.files || !req.files.length)
    return next(new Errors.BadRequest(ErrorCodes.NO_FILE_UPLOADED));

  const files = req.files as Express.Multer.File[];

  if (files.length > 3)
    return next(new Errors.BadRequest(ErrorCodes.MAXIMUM_FILE_UPLOAD));

  if (product?.images?.length)
    return next(new Errors.BadRequest(ErrorCodes.PRODUCT_ALREADY_HAS_IMAGES));

  let finalImagesData: {
    secure_url: string;
    public_id: string;
    folder_id: string;
  }[] = [];

  for (const file of files) {
    const result = await uploadImageToCloudinary(
      file,
      env.mediaStorage.cloudinary.images.product
    );
    if (!result?.secure_url || !result.public_id) {
      return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));
    }
    finalImagesData.push(result);
  }

  product.images = finalImagesData;
  await product.save();

  try {
    res.status(201).json({
      success: true,
      message: "Images added successfully",
      data: product,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
