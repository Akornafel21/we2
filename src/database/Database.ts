import mongoose from "mongoose";
import config from "../config/config.json";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(config.db.connectionString);
  console.log("MongoDB connected");
}