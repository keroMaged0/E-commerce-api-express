import { cloudinaryConnection } from "../config/cloudinary.config";
import { logger } from "../config/winston";
import { Crypto } from "./crypto.utils";

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  pathUrl: string,
  newPublicId?: string | null,
  folderIdOverride?: string | null
) => {
  const folderId = folderIdOverride || Crypto.generateCode(10);
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinaryConnection().uploader.upload_stream(
        {
          folder: `${pathUrl}${folderId}`,
          public_id: newPublicId || file.originalname,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      folder_id: folderId,
    };
  } catch (error) {
    logger.error(error);
  }
};

export const updateImage = async (
  oldPublicId,
  folderId,
  file: Express.Multer.File
) => {
  try {
    const basePath = oldPublicId.split(`${folderId}`)[0];

    const uploadResult = await uploadImageToCloudinary(
      file,
      basePath,
      file.originalname,
      folderId
    );
    await cloudinaryConnection().uploader.destroy(oldPublicId);

    return uploadResult?.secure_url;
  } catch (error) {
    logger.error(error);
  }
};
