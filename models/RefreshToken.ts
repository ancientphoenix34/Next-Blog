import mongoose, { Schema, Model } from "mongoose";
import { IRefreshToken } from "@/types";

const refreshTokenSchema = new Schema<IRefreshToken>({
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
});

// MongoDB TTL index — automatically deletes expired documents from the collection
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken =
    (mongoose.models.RefreshToken as Model<IRefreshToken>) ||
    mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
