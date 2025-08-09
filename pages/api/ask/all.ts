import { NextApiRequest, NextApiResponse } from "next";
import { getAllAskPost } from "@/lib/actions/ask.action"; // Import hàm lấy tất cả bài đăng

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { posts, total } = await getAllAskPost(page, limit);

      return res.status(200).json({ posts, total }); // Trả về kết quả
    } catch (error) {
      console.error("Error in fetching ask posts:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
