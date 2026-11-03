import Link from "next/link";
import { Heart, MessageCircle, ArrowUpRight } from "lucide-react";
import type { PostSummary } from "@/types";
export function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  return <article className={featured ? "post-card featured-card" : "post-card"}>
    <Link href={`/posts/${post.slug}`} className="card-image-wrap">
      {post.coverImage ? <img className="card-image" src={post.coverImage} alt="" /> : <div className="image-placeholder"><span>INKWELL</span></div>}
      {featured && <span className="image-label">EDITOR&apos;S PICK</span>}
    </Link>
    <div className="card-body"><div className="eyebrow-row"><span className="category">{post.category}</span><span className="muted-dot">·</span><span className="muted">{post.readTime} min read</span></div>
      <Link href={`/posts/${post.slug}`}><h3 className="card-title">{post.title}<ArrowUpRight className="title-arrow" size={18}/></h3></Link>
      <p className="card-excerpt">{post.excerpt}</p>
      <div className="card-footer"><div className="author-mini"><span className="avatar">{post.author?.name?.[0] || "I"}</span><span>{post.author?.name || "Guest writer"}</span></div><div className="post-stats"><span><Heart size={14}/>{post.likesCount}</span><span><MessageCircle size={14}/>{post.commentsCount}</span></div></div>
    </div>
  </article>;
}
