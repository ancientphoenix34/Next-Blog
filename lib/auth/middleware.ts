import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { HttpError } from "@/models/HttpError";
import { JwtPayload } from "@/types";

export async function authenticate(req: NextRequest): Promise<JwtPayload> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError("No token provided", 403);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch {
    throw new HttpError("Invalid or expired token", 403);
  }
}
