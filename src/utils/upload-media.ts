import { cloudinaryConnection } from "../config/cloudinary.config";

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  pathUrl: string,
  newPublicId?: string
) => {
  try {
    return await cloudinaryConnection().uploader.upload(file.path, {
      folder: pathUrl,
      public_id: newPublicId,
    });
  } catch (error) {
    console.log(error);
  }
};

