import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    // ── Validation ─────────────────────────────────────────────────────────
    if (!name || !email || !password || !confirmPassword) {
      throw new HttpError("All fields are required", 422);
    }

    if (password !== confirmPassword) {
      throw new HttpError("Passwords do not match", 422);
    }

    if (password.length < 6) {
      throw new HttpError("Password must be at least 6 characters", 422);
    }

    // ── Database ────────────────────────────────────────────────────────────
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError("Email already in use", 422);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
