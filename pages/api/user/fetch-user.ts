import { NextApiRequest, NextApiResponse } from "next";
import { authenticateToken } from "@/middleware/auth-middleware"; // Middleware xác thực token
import { fetchUser } from "@/lib/actions/user.acion";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  authenticateToken(req, res, async () => {
    if (req.method === "GET") {
      try {
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ message: "User not authenticated" });
        }

        const userIdString =
          userId instanceof Object ? userId.toString() : userId;

        const result = await fetchUser(userIdString);

        if (!result.success) {
          return res.status(404).json(result);
        }

        return res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        return res
          .status(500)
          .json({ message: "An unexpected error occurred." });
      }
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  });
}
