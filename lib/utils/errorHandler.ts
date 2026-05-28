import { NextResponse } from "next/server";
import { HttpError } from "@/models/HttpError";

export function handleError(err: unknown): NextResponse {
    console.error(err);

    if (err instanceof HttpError) {
        return NextResponse.json(
            { message: err.message, code: err.code },
            { status: err.code }
        );
    }

    return NextResponse.json(
        { message: "An unexpected error occurred", code: 500 },
        { status: 500 }
    );
}
