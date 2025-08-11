import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware, {
  authenticateToken,
} from "@/middleware/auth-middleware";
import { deleteAskPost } from "@/lib/actions/ask.action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return corsMiddleware(req, res, async () => {
    return authenticateToken(req, res, async () => {
      if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` });
      }

      try {
        const { postId } = req.body || {};
        const userId = req.user?.id?.toString();

        if (!postId) {
          return res.status(400).json({ message: "postId is required" });
        }

        const result = await deleteAskPost(userId, postId);
        return res
          .status(result.success ? 200 : 400)
          .json({ message: result.message });
      } catch (error) {
        console.error("Error in /api/ask/delete:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  });
}
