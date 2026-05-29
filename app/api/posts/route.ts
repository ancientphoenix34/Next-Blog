import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { authenticate } from "@/lib/auth/middleware";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import Post from "@/models/Post";
import User from "@/models/User";
import { uploadImage } from "@/lib/cloudinary";
import { Category } from "@/types";

const MAX_SIZE = 5 * 1024 * 1024;

// ── GET /api/posts ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find().sort({ updatedAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    return handleError(err);
  }
}

// ── POST /api/posts ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const currentUser = await authenticate(req);

    const formData    = await req.formData();
    const title       = formData.get("title") as string;
    const category    = formData.get("category") as Category;
    const description = formData.get("description") as string;
    const thumbnail   = formData.get("thumbnail") as File | null;

    if (!title || !category || !description) {
      throw new HttpError("Title, category and description are required", 422);
    }

    if (description.length < 12) {
      throw new HttpError("Description must be at least 12 characters", 422);
    }

    if (!thumbnail) {
      throw new HttpError("Thumbnail image is required", 422);
    }

    if (thumbnail.size > MAX_SIZE) {
      throw new HttpError("Thumbnail too large. Max size is 5MB", 422);
    }

    const { url, publicId } = await uploadImage(thumbnail, "blog/thumbnails");

    await connectDB();

    const post = await Post.create({
      title,
      category,
      description,
      thumbnail:          url,
      thumbnailPublicId:  publicId,
      creator:            currentUser.id,
    });

    // Atomically increment the author's post count
    await User.findByIdAndUpdate(currentUser.id, { $inc: { posts: 1 } });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
