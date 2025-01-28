import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/E-commerce-express")
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};
