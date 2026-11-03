import { Types } from "mongoose";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function listComments(postId: string) {
  await connectDB();
  const comments = await Comment.find({ postId }).populate("author", "name avatar").sort({ createdAt: 1 }).lean();
  return ok(comments.map((c: any) => ({ ...c, _id: String(c._id), postId: String(c.postId),
    parentId: c.parentId ? String(c.parentId) : null,
    author: { _id: String(c.author._id), name: c.author.name, avatar: c.author.avatar },
    likes: c.likes.map(String) })));
}
export async function createComment(postId: string, body: any) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Sign in to join the discussion.", 401); }
  await connectDB();
  if (!Types.ObjectId.isValid(postId) || !(await Post.exists({ _id: postId }))) return fail("Story not found", 404);
  const text = String(body.body || "").trim();
  if (!text || text.length > 2000) return fail("Comment must be between 1 and 2000 characters.", 422);
  const parentId = body.parentId || null;
  if (parentId) {
    const parent = await Comment.findOne({ _id: parentId, postId });
    if (!parent) return fail("Parent comment not found.", 404);
  }
  const comment = await Comment.create({ postId, parentId, body: text, author: userId });
  await Post.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });
  await comment.populate("author", "name avatar");
  return ok({ ...comment.toObject(), _id: String(comment._id), postId, parentId,
    author: { _id: String(comment.author._id), name: comment.author.name, avatar: comment.author.avatar }, likes: [] }, 201);
}
export async function toggleCommentLike(commentId: string) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Sign in to like comments.", 401); }
  await connectDB();
  const comment = await Comment.findById(commentId);
  if (!comment) return fail("Comment not found", 404);
  const exists = comment.likes.some((x: any) => String(x) === userId);
  if (exists) comment.likes.pull(userId as any); else comment.likes.push(userId as any);
  await comment.save();
  return ok({ liked: !exists, likesCount: comment.likes.length });
}
export async function deleteComment(commentId: string) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Sign in.", 401); }
  await connectDB();
  const comment = await Comment.findById(commentId);
  if (!comment) return fail("Comment not found", 404);
  if (String(comment.author) !== userId) return fail("You can only delete your own comment.", 403);
  const descendants: string[] = [String(comment._id)];
  // Remove every nested descendant, not only direct replies.
  let frontier = [String(comment._id)];
  while (frontier.length) {
    const children = await Comment.find({ parentId: { $in: frontier } }).select("_id").lean();
    frontier = children.map((x: any) => String(x._id));
    descendants.push(...frontier);
  }
  await Comment.deleteMany({ _id: { $in: descendants } });
  await Post.updateOne({ _id: comment.postId }, { $inc: { commentsCount: -descendants.length } });
  return ok({ message: "Comment deleted" });
}
