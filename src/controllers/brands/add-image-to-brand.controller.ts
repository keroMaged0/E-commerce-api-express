import { RequestHandler } from "express";

import { uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Brand } from "../../models/brand.model";
import { logger } from "../../config/winston";
import { env } from "../../config/env";
import { Errors } from "../../errors";

export const addImageToBrandHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const brnad = await Brand.findById(req.params.id);
    if (!brnad)
      return next(new Errors.NotFoundError(ErrorCodes.BRAND_NOT_FOUND));

    if (brnad.logo.public_id)
      return next(new Errors.BadRequest(ErrorCodes.BRAND_ALREADY_HAS_IMAGE));

    if (!req.file)
      return next(new Errors.BadRequest(ErrorCodes.NO_FILE_UPLOADED));

    const file = req.file as Express.Multer.File;
    const result = await uploadImageToCloudinary(
      file,
      env.mediaStorage.cloudinary.images.brand
    );
    if (!result?.secure_url || !result.public_id)
      return next(new Errors.internalServerError(ErrorCodes.CLOUDINARY_ERROR));

    brnad.logo = {
      public_id: result.public_id,
      secure_url: result.secure_url,
      folder_id: result.folder_id,
    };
    await brnad.save();

    res.json({
      success: true,
      message: "Image added to brand successfully",
      data: {},
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
