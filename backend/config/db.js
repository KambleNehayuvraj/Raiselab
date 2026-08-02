import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // ✅ use .env value
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
  console.error("❌ MongoDB connection failed:");
  console.error(error); // Print the full error object
  process.exit(1);
}
};
