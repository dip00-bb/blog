import mongoose, { Schema, models, model } from "mongoose";
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 240 }
}, { timestamps: true });
export default models.User || model("User", UserSchema);
