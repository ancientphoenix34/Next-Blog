import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import { authenticate } from "@/lib/auth/middleware";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await authenticate(req);
    const { name, email, currentPassword, newPassword } = await req.json();

    if (!name || !email || !currentPassword) {
      throw new HttpError("Name, email and current password are required", 422);
    }

    await connectDB();

    // Fetch user WITH password (select: false means we must opt in)
    const user = await User.findById(currentUser.id).select("+password");
    if (!user) throw new HttpError("User not found", 404);

    // Verify current password before allowing any change
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new HttpError("Current password is incorrect", 403);

    // Check new email isn't taken by someone else
    if (email !== user.email) {
      const taken = await User.findOne({ email });
      if (taken) throw new HttpError("Email already in use", 422);
    }

    user.name  = name;
    user.email = email;

    if (newPassword) {
      if (newPassword.length < 6) {
        throw new HttpError("New password must be at least 6 characters", 422);
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    return handleError(err);
  }
}
