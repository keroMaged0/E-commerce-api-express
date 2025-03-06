import mongoose from "mongoose";

import { logger } from "./winston";
import { env } from "./env";

export const dbConnection = async () => {
  await mongoose
    .connect(env.db.dbHost)
    .then(() => {
      console.log("✅ Connected to MongoDB!");
    })
    .catch((err) => {
      console.error("❌ Connection error:", err);
    });
};
