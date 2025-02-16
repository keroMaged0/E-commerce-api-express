import { RequestHandler } from "express";

import { cloudinaryConnection } from "../../config/cloudinary.config";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Brand } from "../../models/brand.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const deleteBrandHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const userId = req.loggedUser.user_id;
    const { id } = req.params;

    const brand = await Brand.findOneAndUpdate(
      { _id: id, created_by: userId, is_deleted: false },
      {
        is_deleted: true,
      }
    );
    if (!brand)
      return next(new Errors.NotFoundError(ErrorCodes.BRAND_NOT_FOUND));

    if (brand.logo.public_id)
      await cloudinaryConnection().uploader.destroy(brand.logo.public_id);

    res.json({
      success: true,
      message: "Brand deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
