import { Schema, models, model } from "mongoose";
const CommentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });
export default models.Comment || model("Comment", CommentSchema);
