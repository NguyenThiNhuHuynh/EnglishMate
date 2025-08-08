import { RegisterDTO, UserResponseDTO } from "@/dtos/user.dto";
import { createUserWithRole } from "@/lib/actions/user.acion";
import corsMiddleware from "@/middleware/auth-middleware";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res, async () => {
    if (req.method === "POST") {
      try {
        const params: RegisterDTO = req.body;
        const role =
          (req.body.role as "student" | "teacher" | "admin") || "student";
        if (!["student", "teacher", "admin"].includes(role)) {
          return res.status(400).json({
            success: false,
            message: "Invalid role!",
          });
        }
        const result = await createUserWithRole(params, role);

        if (!result.success) {
          let statusCode = 400;
          if (result.message === "User already exists!") {
            statusCode = 409;
          } else if (result.message === "Confirm password does not match!") {
            statusCode = 422;
          }
          return res.status(statusCode).json(result);
        }

        return res.status(201).json(result);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res
          .status(500)
          .json({ message: "An unexpected error occurred." });
      }
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  });
}
