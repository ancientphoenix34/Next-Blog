import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types";

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!ACCESS_SECRET) throw new Error("Define JWT_SECRET in .env.local");
if (!REFRESH_SECRET) throw new Error("Define JWT_REFRESH_SECRET in .env.local");

// Access token — short-lived, sent in Authorization header
export function signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

// Refresh token — long-lived, sent only as HttpOnly cookie
export function signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

