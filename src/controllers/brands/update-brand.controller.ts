import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { updateImage } from "../../utils/upload-media";
import { Brand } from "../../models/brand.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const updateBrandHandler: RequestHandler<
  { id: string },
  SuccessResponse,
  {
    name: string;
    description?: string;
    oldPublicId?: string;
  }
> = async (req, res, next) => {
  try {
    const { name, description, oldPublicId } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return next(new Errors.NotFoundError(ErrorCodes.BRAND_NOT_FOUND));
    }

    if (oldPublicId) {
      if (!req.file)
        return next(new Errors.BadRequest(ErrorCodes.FILE_REQUIRED));

      const result = await updateImage(req.file, oldPublicId, req.file);
      if (!result)
        return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

      brand.logo = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        folder_id: result.folder_id,
      };
    }

    if (name) brand.name = name;
    if (description) brand.description = description;

    res.json({
      message: "Brand updated successfully",
      success: true,
      data: {},
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
