import type { NextApiRequest, NextApiResponse } from "next";
import { getAskPostById } from "@/lib/actions/ask.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const id = (req.query.id as string) || "";
    if (!id) return res.status(400).json({ message: "id is required" });

    const post = await getAskPostById(id);
    return res.status(200).json({ post });
  } catch (error) {
    console.error("Error in fetching ask post by id:", error);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
}
