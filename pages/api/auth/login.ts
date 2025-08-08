import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import corsMiddleware from "@/middleware/auth-middleware";
import { LoginDTO } from "@/dtos/user.dto";

const SECRET_KEY = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res, async () => {
    if (req.method === "POST") {
      try {
        const loginUser: LoginDTO = req.body;
        await connectToDatabase();

        const existedUser = await User.findOne({
          $or: [
            { phoneNumber: loginUser.emailOrPhone },
            { email: loginUser.emailOrPhone },
          ],
        });

        if (!existedUser) {
          return res.status(400).json({
            success: false,
            message: "User does not exist!",
          });
        }

        const isPasswordValid = await bcrypt.compare(
          loginUser.password,
          existedUser.password
        );

        if (!isPasswordValid) {
          return res.status(400).json({
            success: false,
            message: "Password is incorrect!",
          });
        }

        const token =
          "Bearer " +
          jwt.sign(
            {
              id: existedUser.id,
              username: existedUser.firstName + " " + existedUser.lastName,
              roles: [existedUser.role],
            },
            SECRET_KEY
            // { expiresIn: "2h" }
          );

        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          role: existedUser.role,
        });
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
