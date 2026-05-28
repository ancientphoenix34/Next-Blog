import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // ── Validation ─────────────────────────────────────────────────────────
        if (!email || !password) {
            throw new HttpError("Email and password are required", 422);
        }

        // ── Find user (explicitly select password) ──────────────────────────────
        await connectDB();

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new HttpError("Invalid credentials", 403);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpError("Invalid credentials", 403);
        }

        // ── Sign tokens ─────────────────────────────────────────────────────────
        const payload = { id: user._id.toString(), name: user.name };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // ── Persist refresh token ───────────────────────────────────────────────
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

        // ── Build response ──────────────────────────────────────────────────────
        const response = NextResponse.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });

        // Set refresh token as HttpOnly cookie
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // seconds
            path: "/",
        });

        return response;

    } catch (err) {
        return handleError(err);
    }
}
