import { v2 as cloudinary } from "cloudinary";

import { env } from "./env";
export const cloudinaryConnection = () => {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName!,
    api_key: env.cloudinary.apiKey!,
    api_secret: env.cloudinary.apiSecret!,
  });
  return cloudinary;
};
