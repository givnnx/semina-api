import app from "../src/app";
import { connectToDb } from "../src/app/db";

// Vercel Serverless Function Wrapper
export default async (req: any, res: any) => {
  try {
    await connectToDb();
    return app(req, res);
  } catch (error) {
    console.error("Error in serverless handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
