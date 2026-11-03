"use client";
import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
export function ShareMenu({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/posts/${slug}` : `${process.env.NEXT_PUBLIC_APP_URL}/posts/${slug}`;
  async function copy() { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
  const encoded = encodeURIComponent(url), text = encodeURIComponent(title);
  return <div className="share-wrap"><button className="button button-outline" onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Copied" : "Copy link"}</button>
    <a className="share-link" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${text}%20${encoded}`}>WhatsApp</a>
    <a className="share-link" target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}>Facebook</a>
    <a className="share-link" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${text}&url=${encoded}`}>X</a>
    <button className="icon-button" aria-label="Share" onClick={() => navigator.share?.({ title, url })}><Share2 size={17}/></button>
  </div>;
}
