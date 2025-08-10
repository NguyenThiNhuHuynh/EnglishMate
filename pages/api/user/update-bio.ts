import { updateUserBio } from "@/lib/actions/user.acion";
import corsMiddleware, {
  authenticateToken,
} from "@/middleware/auth-middleware";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return corsMiddleware(req, res, async () => {
    return authenticateToken(req, res, async () => {
      if (req.method !== "PATCH") {
        res.setHeader("Allow", ["PATCH"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }

      try {
        const params: { bio: string } = req.body;
        const userId = req.user?.id?.toString();

        const updatedBio = await updateUserBio(userId, params);

        if (!updatedBio) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(updatedBio);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  });
}
