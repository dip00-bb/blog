import mongoose, { Schema, models, model } from "mongoose";
const PostSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true, maxlength: 260 },
  content: { type: String, required: true },
  coverImage: { type: String, default: "" },
  category: { type: String, default: "Ideas", index: true },
  tags: [{ type: String, trim: true }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });
PostSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });
export default models.Post || model("Post", PostSchema);
