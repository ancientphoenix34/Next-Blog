import mongoose, { Schema, Model } from "mongoose";
import { IPost, Category } from "@/types";

const CATEGORIES: Category[] = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "Weather",
    "Uncategorized",
];

const postSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        category: { type: String, enum: CATEGORIES, default: "Uncategorized" },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Post = (mongoose.models.Post as Model<IPost>) ||
    mongoose.model<IPost>("Post", postSchema);

export default Post;
