import { config } from "dotenv";

config();

export const env = {
  port: +(process.env.DEV_PORT || 3000) as number,
  environment: process.env.NODE_ENV?.trim() || "development",
  frontUrl: process.env.FRONT_URL?.split(",").map((el) =>
    el.trim()
  ) as string[],
  apiUrl: process.env.API_URL!,
  token: {
    secret: process.env.TOKEN_SECRET!,
    expiresIn: process.env.TOKEN_EXPIRES_IN,
    expiresInRefresh: process.env.TOKEN_EXPIRES_IN_REFRESH,
  },
  bcrypt: {
    salt: +(process.env.BCRYPT_SALT || 1) as number,
    paper: process.env.BCRYPT_PAPER,
  },
  sendEmail: {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT!,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    secure: process.env.SEND_EMAIL_SECURE === "true",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },

  mediaStorage: {
    cloudinary: {
      folder: process.env.CLOUDINARY_FOLDER || "default-folder",
      images: {
        category: process.env.CLOUDINARY_CATEGORY || "default-category-folder",
        subcategory:
          process.env.CLOUDINARY_SUBCATEGORY || "default-subcategory-folder",
        product: process.env.CLOUDINARY_PRODUCT || "default-product-folder",
        brand: process.env.CLOUDINARY_BRAND || "default-product-folder",
      },
    },
  },
};
