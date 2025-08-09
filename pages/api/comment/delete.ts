import { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware, {
  authenticateToken,
} from "@/middleware/auth-middleware";
import { deleteComment } from "@/lib/actions/comment.action";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  corsMiddleware(req, res, async () => {
    authenticateToken(req, res, async () => {
      if (req.method === "DELETE") {
        try {
          const { commentId } = req.body;
          const userId = req.user?.id?.toString();

          if (!commentId || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
          }

          const result = await deleteComment(commentId, userId);

          return res
            .status(result.success ? 200 : 400)
            .json({ message: result.message });
        } catch (error) {
          console.error("Error in deleteComment API:", error);
          return res
            .status(500)
            .json({ message: "An unexpected error occurred" });
        }
      } else {
        return res.status(405).json({ message: "Method Not Allowed" });
      }
    });
  });
};

export default handler;
