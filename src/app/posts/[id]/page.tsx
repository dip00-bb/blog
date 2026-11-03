"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Clock, Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/client";
import { ShareMenu } from "@/components/share-menu";
import { Comments } from "@/components/comments";
import type { PostSummary } from "@/types";
export default function PostPage() {
 const params=useParams<{id:string}>(),router=useRouter();const [post,setPost]=useState<any>(null),[user,setUser]=useState<any>(null),[liked,setLiked]=useState(false),[loading,setLoading]=useState(true);
 async function load(){try{const p=await api<any>(`/api/posts/${params.id}`);setPost(p);const u=await api<any>("/api/auth/me").catch(()=>null);setUser(u);setLiked(Boolean(p.likedByMe));}catch{setPost(null)}finally{setLoading(false)}}
 useEffect(()=>{load()},[params.id]);
 async function like(){try{const d=await api<any>(`/api/posts/${post._id}/like`,{method:"POST"});setLiked(d.liked);setPost((p:any)=>({...p,likesCount:d.likesCount}));}catch(e:any){alert(e.message)}}
 async function remove(){if(!confirm("Permanently delete this story?"))return;try{await api(`/api/posts/${post._id}`,{method:"DELETE"});router.push("/")}catch(e:any){alert(e.message)}}
 if(loading)return <p className="loading">Opening story…</p>;
 if(!post)return <div className="not-found"><h1>Story not found.</h1><Link className="button button-dark" href="/">Back home</Link></div>;
 return <main className="article-wrap"><article><header className="article-top"><span className="eyebrow">{post.category} · {post.readTime} MIN READ</span><h1>{post.title}</h1><p className="article-excerpt">{post.excerpt}</p><div className="article-meta"><span className="avatar">{post.author?.name?.[0]}</span><strong>{post.author?.name}</strong><span>·</span><span>{new Date(post.createdAt).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}</span></div></header>
 {post.coverImage&&<img className="article-cover" src={post.coverImage} alt={post.title}/>}<div className="article-tools"><button className={liked?"like-button liked":"like-button"} onClick={like}><Heart size={16} fill={liked?"currentColor":"none"}/>{post.likesCount} appreciations</button><div className="share-wrap"><ShareMenu title={post.title} slug={post.slug}/>{user?._id===post.author?._id&&<><Link href={`/write?edit=${post._id}`} className="icon-button" aria-label="Edit"><Pencil size={15}/></Link><button className="icon-button" onClick={remove} aria-label="Delete"><Trash2 size={15}/></button></>}</div></div>
 <div className="article-content">{post.content.split(/\n{2,}/).map((p:string,i:number)=><p key={i}>{p}</p>)}</div>
 {post.tags?.length>0&&<div className="tag-row" style={{display:"flex",gap:8,margin:"35px 0",flexWrap:"wrap"}}>{post.tags.map((t:string)=><span className="button button-outline" key={t}>#{t}</span>)}</div>}
 </article><Comments postId={post._id}/></main>;
}
