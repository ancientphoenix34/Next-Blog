import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { handleError } from "@/lib/utils/errorHandler";
import { HttpError } from "@/models/HttpError";
import User from "@/models/User";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        await connectDB();

        const user = await User.findById(id).select("-password");
        if (!user) {
            throw new HttpError("User not found", 404);
        }

        return NextResponse.json(user);
    } catch (err) {
        return handleError(err);
    }
}
