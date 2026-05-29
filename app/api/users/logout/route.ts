import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import RefreshToken from "@/models/RefreshToken";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("refreshToken")?.value;

    if (token) {
      await connectDB();
      await RefreshToken.deleteOne({ token });
    }

    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   0,
      path:     "/",
    });

    return response;
  } catch (err) {
    return handleError(err);
  }
}
