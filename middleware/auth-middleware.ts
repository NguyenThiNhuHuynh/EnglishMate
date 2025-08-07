import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Cors from "cors";
import { DecodedToken } from "@/types/auth";

const SECRET_KEY = process.env.JWT_SECRET!;
declare module "next" {
  interface NextApiRequest {
    user?: DecodedToken;
  }
}

export function authenticateToken(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const isOpenApi = req.headers["isopenapi"];
  const authHeader = isOpenApi
    ? req.headers["auth"]
    : req.headers["authorization"];
  if (!authHeader || Array.isArray(authHeader)) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Access token is missing" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function authorizeRole(roles: string[]) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    if (!req.user || !Array.isArray(req.user.roles)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have the required role" });
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have the required role" });
    }

    next();
  };
}
const cors = Cors({
  methods: ["GET", "POST", "PATCH", "HEAD", "DELETE"],
  origin: "*",
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  await runMiddleware(req, res, cors);
  next();
}
