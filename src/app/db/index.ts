import mongoose from "mongoose";
import { urlDb } from "../config";

let isConnected = false;

const connectToDb = async () => {
  if (isConnected) {
    return;
  }

  // Check if we have a connection; 1 = connected
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    const db = await mongoose.connect(urlDb, {
      dbName: "db_semina",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = !!db.connections[0].readyState;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

const db = mongoose.connection;
export default db;
export { connectToDb };
