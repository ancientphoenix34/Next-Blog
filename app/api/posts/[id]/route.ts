import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { authenticate } from "@/lib/auth/middleware";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import Post from "@/models/Post";
import User from "@/models/User";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { Category } from "@/types";

type Params = { params: Promise<{ id: string }> };

// ── GET /api/posts/:id ───────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post) throw new HttpError("Post not found", 404);

    return NextResponse.json(post);
  } catch (err) {
    return handleError(err);
  }
}

// ── PATCH /api/posts/:id ─────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const currentUser = await authenticate(req);
    const { id }      = await params;

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

    await connectDB();

    const post = await Post.findById(id);
    if (!post) throw new HttpError("Post not found", 404);

    // Only the creator can edit their post
    if (post.creator.toString() !== currentUser.id) {
      throw new HttpError("You are not authorized to edit this post", 403);
    }

    // Thumbnail is optional on edit — only replace if a new one was sent
    if (thumbnail && thumbnail.size > 0) {
      const MAX_SIZE = 5 * 1024 * 1024;
      if (thumbnail.size > MAX_SIZE) {
        throw new HttpError("Thumbnail too large. Max size is 5MB", 422);
      }
      await deleteImage(post.thumbnailPublicId);
      const { url, publicId }  = await uploadImage(thumbnail, "blog/thumbnails");
      post.thumbnail           = url;
      post.thumbnailPublicId   = publicId;
    }

    post.title       = title;
    post.category    = category;
    post.description = description;
    await post.save();

    return NextResponse.json(post);
  } catch (err) {
    return handleError(err);
  }
}

// ── DELETE /api/posts/:id ────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const currentUser = await authenticate(req);
    const { id }      = await params;

    await connectDB();

    const post = await Post.findById(id);
    if (!post) throw new HttpError("Post not found", 404);

    if (post.creator.toString() !== currentUser.id) {
      throw new HttpError("You are not authorized to delete this post", 403);
    }

    await deleteImage(post.thumbnailPublicId);
    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(currentUser.id, { $inc: { posts: -1 } });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}
