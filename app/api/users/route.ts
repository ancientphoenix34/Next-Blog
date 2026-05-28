import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select("-password");

    return NextResponse.json(users);
  } catch (err) {
    return handleError(err);
  }
}
