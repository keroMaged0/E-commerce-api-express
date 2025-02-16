import mongoose from "mongoose";
import { logger } from "./winston";

export const dbConnection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/E-commerce-express")
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      logger.error(err);
    });
};
