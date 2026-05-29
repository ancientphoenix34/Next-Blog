import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import Post from "@/models/Post";
import { Category } from "@/types";

type Params = { params: Promise<{ category: Category }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { category } = await params;

    await connectDB();

    const posts = await Post.find({ category }).sort({ updatedAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    return handleError(err);
  }
}
