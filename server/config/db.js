import mongoose from "mongoose";

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  connectionPromise = mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    })
    .then((conn) => {
      isConnected = true;

      console.log(`MongoDB Connected: ${conn.connection.host}`);

      return conn;
    })
    .catch((error) => {
      isConnected = false;
      connectionPromise = null;

      console.error(`MongoDB Connection Error: ${error.message}`);

      throw error;
    });

  return connectionPromise;
};

export default connectDB;
export { connectDB };
