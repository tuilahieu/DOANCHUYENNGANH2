import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export async function connectDB() {
  try {
    console.log("ĐANG KẾT NỐI TỚI CSDL...");
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("KẾT NỐI THÀNH CÔNG !!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function getDB() {
  if (!db) throw new Error("Database not connected");
  return db;
}

export async function disconnectDB() {
  if (client) {
    await client.close();
    console.log("✅ MongoDB disconnected");
  }
}
