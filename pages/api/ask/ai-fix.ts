import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware, {
  authenticateToken,
} from "@/middleware/auth-middleware";
import { aiFixAskPost } from "@/lib/actions/ai-history.action";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  corsMiddleware(req, res, async () => {
    authenticateToken(req, res, async () => {
      if (req.method === "POST") {
        const { id } = req.query;

        if (!id || typeof id !== "string") {
          return res.status(400).json({ message: "Invalid AskPost ID" });
        }

        try {
          const { fixedPost, aiHistory } = await aiFixAskPost(id);

          return res.status(200).json({ fixedPost, aiHistory });
        } catch (error) {
          console.error("Error in aiFixAskPost:", error);
          return res
            .status(500)
            .json({ message: "An unexpected error occurred." });
        }
      } else {
        return res.status(405).json({ message: "Method Not Allowed" });
      }
    });
  });
};

export default handler;
