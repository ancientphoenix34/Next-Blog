import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import RefreshToken from "@/models/RefreshToken";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    // ── Read cookie ─────────────────────────────────────────────────────────
    const token = req.cookies.get("refreshToken")?.value;

    if (!token) {
      throw new HttpError("No refresh token", 403);
    }

    // ── Verify JWT signature ────────────────────────────────────────────────
    const decoded = verifyRefreshToken(token);

    // ── Check token exists in DB (not revoked) ──────────────────────────────
    await connectDB();

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      throw new HttpError("Refresh token revoked or invalid", 403);
    }

    // ── Token rotation — delete old, issue new ──────────────────────────────
    await RefreshToken.deleteOne({ token });

    const payload        = { id: decoded.id, name: decoded.name };
    const newAccessToken  = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: newRefreshToken, userId: decoded.id, expiresAt });

    // ── Return new access token + set new cookie ────────────────────────────
    const response = NextResponse.json({ accessToken: newAccessToken });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   7 * 24 * 60 * 60,
      path:     "/",
    });

    return response;

  } catch (err) {
    return handleError(err);
  }
}
