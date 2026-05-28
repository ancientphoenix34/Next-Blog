import { Document, Types } from "mongoose";
import { Interface } from "readline";

// ─── Category ────────────────────────────────────────────────────────────────
export type Category =
    | "Agriculture"
    | "Business"
    | "Education"
    | "Entertainment"
    | "Art"
    | "Investment"
    | "Weather"
    | "Uncategorized";

// ─── User ────────────────────────────────────────────────────────────────────
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    avatarPublicId?: string;
    posts: number;
}

// Omit<> strips the password field — used whenever we send a user to the client
// It creates a new type from IUser without the password field.
export type SafeUser = Omit<IUser, "password">;

// ─── Post ────────────────────────────────────────────────────────────────────

export interface IPost extends Document {
    _id: Types.ObjectId;
    title: string;
    category: Category;
    description: string;
    thumbnail: string;
    creator: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface JwtPayload {
    id: string;
    name: string;
}

export interface IRefreshToken extends Document {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
    message: string;
    code: number;
}