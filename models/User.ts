import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "@/types";

const userSchema = new Schema<IUser>({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  // This is a security default. Any time you do User.find() or User.findById(), 
  // the password field is automatically excluded from the result. 
  // You have to explicitly opt-in with .select('+password')
  password: { type: String, required: true, select: false },
  avatar:   { type: String },
  avatarPublicId: { type: String },
  posts:    { type: Number, default: 0 },
});

// Prevents model re-registration during hot-reload in development
const User = (mongoose.models.User as Model<IUser>) ||
             mongoose.model<IUser>("User", userSchema);

export default User;
