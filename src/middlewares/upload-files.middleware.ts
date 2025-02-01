import multer from "multer";
import { v4 } from "uuid";

import { BadRequest } from "../errors/bad-request.error";
import { ErrorCodes } from "../types/errors-code.type";

export interface UploadOptions {
  fileType?: string[];
  maxSize?: number;
  fileFilter?(
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ): void;
}

export const uploadMemoryStorage = (options?: UploadOptions) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: options?.maxSize || 3000 * 1024 * 1024 }, // 3MB
    fileFilter: options?.fileFilter
      ? options.fileFilter
      : (async function fileFilter(req, file, callback) {
          try {
            file.filename = `${v4()}.${file.originalname.split(".").at(-1)}`;
            const allowedTypes = options?.fileType || ["image"];
            const isAllowedType = allowedTypes.some((allowedType) =>
              file.mimetype.startsWith(allowedType)
            );
            if (!isAllowedType)
              return callback(new BadRequest(ErrorCodes.INVALID_FILE_FORMAT));
            callback(null, true);
          } catch (error) {
            console.log(error);
            return callback(new BadRequest(ErrorCodes.INVALID_FILE_FORMAT));
          }
        } as any),
  });
