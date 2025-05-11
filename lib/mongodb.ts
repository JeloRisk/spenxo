import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env file");
}

export const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
        console.log("MongoDB is connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

