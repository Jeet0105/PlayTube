import mongoose from "mongoose";

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    if (retries > 0) {
      console.log(`Retrying in ${delay / 1000}s... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;