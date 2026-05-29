import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import Post from "@/models/Post";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await connectDB();

    const posts = await Post.find({ creator: id }).sort({ updatedAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    return handleError(err);
  }
}
