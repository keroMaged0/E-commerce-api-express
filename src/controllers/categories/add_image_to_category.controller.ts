import { RequestHandler } from "express";

import { uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { logger } from "../../config/winston";
import { env } from "../../config/env";
import { Errors } from "../../errors";

export const addImageToCategoryHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return next(new Errors.NotFoundError(ErrorCodes.CATEGORY_NOT_FOUND));

    if (category?.image?.public_id)
      return next(new Errors.BadRequest(ErrorCodes.IMAGE_ALREADY_EXISTS));

    if (!req.file)
      return next(new Errors.BadRequest(ErrorCodes.IMAGE_REQUIRED));

    const file = req.file as Express.Multer.File;
    const result = await uploadImageToCloudinary(
      file,
      env.mediaStorage.cloudinary.images.category
    );
    if (!result?.secure_url || !result.public_id)
      return next(
        new Errors.internalServerError(ErrorCodes.CLOUDINARY_UPLOAD_ERROR)
      );

    category.image = {
      public_id: result?.public_id,
      secure_url: result?.secure_url,
      folder_id: result?.folder_id as string,
    };
    await category.save();

    res.json({
      success: true,
      message: "Image added to category successfully",
      data: {},
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
