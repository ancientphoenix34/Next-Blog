import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { authenticate } from "@/lib/auth/middleware";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import User from "@/models/User";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export async function POST(req: NextRequest) {
    try {
        const currentUser = await authenticate(req);

        const formData = await req.formData();
        const file = formData.get("avatar") as File | null;

        if (!file) {
            throw new HttpError("No file provided", 422);
        }

        if (file.size > MAX_SIZE) {
            throw new HttpError("File too large. Max size is 5MB", 422);
        }

        await connectDB();

        const user = await User.findById(currentUser.id);
        if (!user) {
            throw new HttpError("User not found", 404);
        }

        // Delete old avatar from Cloudinary if one exists
        if (user.avatarPublicId) {
            await deleteImage(user.avatarPublicId);
        }

        // Upload new avatar
        const { url, publicId } = await uploadImage(file, "blog/avatars");

        user.avatar = url;
        user.avatarPublicId = publicId;
        await user.save();

        return NextResponse.json({ avatar: url });

    } catch (err) {
        return handleError(err);
    }
}
