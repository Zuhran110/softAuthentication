import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB din't Connect successfully");
    if (err instanceof Error) {
      console.error("name", err.name);
      console.error("message", err.message);
    }
    process.exit(1);
  }
};

export default connectDB;
