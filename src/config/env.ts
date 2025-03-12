import { config } from "dotenv";

config();

export const env = {
  port: +(process.env.DEV_PORT || 3000) as number,
  db: {
    dbConnection: process.env.DB_CONNECTION!,
    dbHost: process.env.DB_HOST! as string,
  },
  environment: process.env.NODE_ENV?.trim() || "development",
  winston: {
    sourceToken: process.env.WINSTON_SOURCE_TOKEN!,
  },
  frontUrl: process.env.FRONT_URL!,
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

  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY!,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
  },

  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },

  cacheKeys: {
    categories: "categories",
    products: "products",
    brands: "brands",
    users: "users",
  },
};
