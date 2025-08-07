import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongoose"; // hoặc đúng path bạn dùng

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: "Database connected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to database" });
  }
}
