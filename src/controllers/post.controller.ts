import { Types } from "mongoose";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { connectDB } from "@/lib/db";
import { requireUser, getSessionUserId } from "@/lib/auth";
import { estimateReadTime, fail, ok, slugify } from "@/lib/api";

function serialize(post: any) {
  const p = post.toObject ? post.toObject() : post;
  return { ...p, _id: String(p._id), author: p.author ? {
    _id: String(p.author._id), name: p.author.name, avatar: p.author.avatar
  } : null, likesCount: p.likes?.length || 0, readTime: estimateReadTime(p.content || ""),
  likes: undefined };
}
export async function listPosts(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const filter: any = {};
  if (q) filter.$text = { $search: q };
  if (category && category !== "All") filter.category = category;
  const mine = searchParams.get("mine");
  const liked = searchParams.get("liked");
  if (mine === "true" || liked === "true") {
    try {
      const userId = await requireUser();
      if (mine === "true") filter.author = userId;
      if (liked === "true") filter.likes = userId;
    } catch { return fail("Please sign in to view your library.", 401); }
  }
  const limit = 9;
  const [posts, total] = await Promise.all([
    Post.find(filter).populate("author", "name avatar").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Post.countDocuments(filter)
  ]);
  return ok({ posts: posts.map(serialize), total, page, pages: Math.ceil(total / limit) });
}
export async function createPost(body: any) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Please sign in to publish.", 401); }
  await connectDB();
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  if (title.length < 5 || content.length < 30 || excerpt.length < 10)
    return fail("Title, excerpt and content are required (content at least 30 characters).", 422);
  let slug = slugify(title);
  if (await Post.exists({ slug })) slug += "-" + Date.now().toString(36);
  const post = await Post.create({
    title, slug, content, excerpt, category: body.category || "Ideas",
    coverImage: body.coverImage || "", tags: Array.isArray(body.tags) ? body.tags.slice(0, 8) : [],
    author: userId
  });
  await post.populate("author", "name avatar");
  return ok(serialize(post), 201);
}
export async function getPost(id: string) {
  await connectDB();
  const post = await Post.findOne({ $or: [{ _id: Types.ObjectId.isValid(id) ? id : null }, { slug: id }] })
    .populate("author", "name avatar");
  if (!post) return fail("Story not found", 404);
  const data = serialize(post);
  const userId = await getSessionUserId();
  return ok({ ...data, likedByMe: Boolean(userId && post.likes.some((x: any) => String(x) === userId)) });
}
export async function updatePost(id: string, body: any) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Please sign in.", 401); }
  await connectDB();
  const post = await Post.findById(id);
  if (!post) return fail("Story not found", 404);
  if (String(post.author) !== userId) return fail("You can only edit your own stories.", 403);
  const fields = ["title", "excerpt", "content", "category", "coverImage", "tags"] as const;
  for (const field of fields) if (body[field] !== undefined) (post as any)[field] = body[field];
  if (body.title) post.slug = slugify(body.title) + "-" + Date.now().toString(36);
  await post.save();
  await post.populate("author", "name avatar");
  return ok(serialize(post));
}
export async function deletePost(id: string) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Please sign in.", 401); }
  await connectDB();
  const post = await Post.findById(id);
  if (!post) return fail("Story not found", 404);
  if (String(post.author) !== userId) return fail("You can only delete your own stories.", 403);
  await Promise.all([Post.deleteOne({ _id: id }), Comment.deleteMany({ postId: id })]);
  return ok({ message: "Story deleted" });
}
export async function togglePostLike(id: string) {
  let userId: string;
  try { userId = await requireUser(); } catch { return fail("Sign in to like stories.", 401); }
  await connectDB();
  const post = await Post.findById(id);
  if (!post) return fail("Story not found", 404);
  const exists = post.likes.some((x: any) => String(x) === userId);
  if (exists) post.likes.pull(userId as any); else post.likes.push(userId as any);
  await post.save();
  return ok({ liked: !exists, likesCount: post.likes.length });
}
