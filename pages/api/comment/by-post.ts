import type { NextApiRequest, NextApiResponse } from "next";
import { getCommentsByPost } from "@/lib/actions/comment.action";
import corsMiddleware from "@/middleware/auth-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return corsMiddleware(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.setHeader("Allow", ["GET", "OPTIONS"]);
      return res.status(200).end();
    }

    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET", "OPTIONS"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
      const postId = (req.query.postId as string) || "";
      const pageNum = Number(req.query.page) || 1;
      const limitNum = Number(req.query.limit) || 10;

      if (!postId) {
        return res.status(400).json({ message: "postId is required" });
      }

      const data = await getCommentsByPost(postId, pageNum, limitNum);
      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error in /api/comment/by-post:", error);
      return res
        .status(500)
        .json({ message: error?.message || "Internal Server Error" });
    }
  });
}
