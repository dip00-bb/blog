export type UserSummary = { _id: string; name: string; email?: string; avatar?: string };
export type PostSummary = {
  _id: string; title: string; slug: string; excerpt: string; content?: string;
  coverImage?: string; category: string; tags: string[]; readTime: number;
  likesCount: number; commentsCount: number; createdAt: string;
  author: UserSummary;
};
export type CommentItem = {
  _id: string; postId: string; parentId: string | null; body: string;
  likes: string[]; createdAt: string; author: UserSummary;
};
