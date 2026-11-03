"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { api } from "@/lib/client";
import type { PostSummary } from "@/types";
export default function LibraryPage(){
 const [tab,setTab]=useState<"mine"|"liked">("mine"),[posts,setPosts]=useState<PostSummary[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>{setLoading(true);setError("");api<{posts:PostSummary[]}>(`/api/posts?${tab}=true`).then(d=>setPosts(d.posts)).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[tab]);
 return <main className="container"><div className="page-head"><span className="eyebrow">YOUR PERSONAL SPACE</span><h1>Your library.</h1><p className="muted">Stories you have written and stories you want to keep close.</p></div><div style={{display:"flex",gap:10,marginBottom:25}}><button className={tab==="mine"?"button button-dark":"button button-outline"} onClick={()=>setTab("mine")}>My stories</button><button className={tab==="liked"?"button button-dark":"button button-outline"} onClick={()=>setTab("liked")}>Liked stories</button></div>{loading?<p className="loading">Loading your library…</p>:error?<p className="empty-note">{error} <Link href="/login">Sign in</Link></p>:posts.length?<div className="post-grid section" style={{paddingTop:0}}>{posts.map(p=><PostCard key={p._id} post={p}/>)}</div>:<p className="empty-note">{tab==="mine"?"You have not published a story yet.":"You have not liked any stories yet."} <Link href={tab==="mine"?"/write":"/explore"}>{tab==="mine"?"Write your first story →":"Explore stories →"}</Link></p>}</main>;
}
