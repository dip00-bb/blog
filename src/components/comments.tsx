
"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import { api } from "@/lib/client";
import type { CommentItem } from "@/types";

type UserInfo = {
  _id: string;
};

function CommentNode({
  item,
  all,
  userId,
  onChanged,
  depth = 0,
}: {
  item: CommentItem;
  all: CommentItem[];
  userId: string | null;
  onChanged: () => void;
  depth?: number;
}) {
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");

  const children = all.filter((c) => c.parentId === item._id);

  async function like() {
    try {
      await api(`/api/comments/${item._id}/like`, {
        method: "POST",
      });
      onChanged();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function sendReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await api(`/api/posts/${item.postId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          body: reply,
          parentId: item._id,
        }),
      });

      setReply("");
      setReplying(false);
      onChanged();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function remove() {
    if (!confirm("Delete this comment and its replies?")) return;

    try {
      await api(`/api/comments/${item._id}`, {
        method: "DELETE",
      });

      onChanged();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div
      className="comment-node"
      style={{ marginLeft: depth ? 22 : 0 }}
    >
      <div className="comment-row">
        <span className="avatar avatar-small">
          {item.author?.name?.[0] || "U"}
        </span>

        <div className="comment-main">
          <div className="comment-meta">
            <strong>{item.author?.name}</strong>
            <span>
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p>{item.body}</p>

          <div className="comment-actions">
            <button onClick={like}>
              <Heart size={14} />
              {item.likes?.length || 0}
            </button>

            <button onClick={() => setReplying(!replying)}>
              <MessageCircle size={14} />
              Reply
            </button>

            {userId === item.author?._id && (
              <button onClick={remove}>
                <Trash2 size={13} />
                Delete
              </button>
            )}
          </div>

          {replying && (
            <form className="reply-form" onSubmit={sendReply}>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a thoughtful reply…"
                required
                maxLength={2000}
              />

              <button className="icon-button" aria-label="Send reply">
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {children.map((child) => (
        <CommentNode
          key={child._id}
          item={child}
          all={all}
          userId={userId}
          onChanged={onChanged}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  async function load() {
    try {
      const [items, user] = await Promise.all([
        api(`/api/posts/${postId}/comments`),
        api("/api/auth/me").catch(() => null),
      ]);

      setComments(items as CommentItem[]);
      setUserId((user as UserInfo | null)?._id ?? null);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  const roots = useMemo(
    () => comments.filter((c) => !c.parentId),
    [comments]
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await api(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });

      setBody("");
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <section className="comments-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE CONVERSATION</span>
          <h2>
            Thoughts & responses{" "}
            <span className="muted">({comments.length})</span>
          </h2>
        </div>
      </div>

      <form className="comment-compose" onSubmit={submit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add something meaningful to the conversation…"
          rows={3}
          maxLength={2000}
          required
        />

        <div className="compose-footer">
          <span className="muted small">
            Be kind. Stay curious.
          </span>

          <button className="button button-dark" type="submit">
            <Send size={15} />
            Comment
          </button>
        </div>
      </form>

      <div className="comment-list">
        {roots.length ? (
          roots.map((c) => (
            <CommentNode
              key={c._id}
              item={c}
              all={comments}
              userId={userId}
              onChanged={load}
            />
          ))
        ) : (
          <p className="empty-note">
            No comments yet. Start the conversation.
          </p>
        )}
      </div>
    </section>
  );
}
