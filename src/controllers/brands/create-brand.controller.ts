import { RequestHandler } from "express";

import { uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Brand } from "../../models/brand.model";
import { logger } from "../../config/winston";
import { env } from "../../config/env";
import { Errors } from "../../errors";

export const createBrandHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {
    name: string;
    description?: string;
  }
> = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    let finalImageData: {
      secure_url: string;
      public_id: string;
      folder_id: string;
    } | null = null;

    if (req.file) {
      const result = await uploadImageToCloudinary(
        req.file,
        env.mediaStorage.cloudinary.images.brand
      );
      if (!result?.secure_url || !result.public_id || !result.public_id)
        return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

      finalImageData = result;
    }

    const brand = new Brand({
      name,
      description,
      logo: finalImageData,
      created_by: req.loggedUser.user_id,
    });
    if (!brand)
      return next(
        new Errors.internalServerError(ErrorCodes.INTERNAL_SERVER_ERROR)
      );
    await brand.save();

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
