"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { api } from "@/lib/client";
import type { PostSummary } from "@/types";
const categories = ["All","Technology","Design","Culture","Lifestyle","Ideas","Business"];
export default function ExplorePage() {
 const [posts,setPosts]=useState<PostSummary[]>([]),[q,setQ]=useState(""),[category,setCategory]=useState("All"),[loading,setLoading]=useState(true);
 async function load(){setLoading(true);try{const d=await api<{posts:PostSummary[]}>(`/api/posts?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);setPosts(d.posts)}catch{}finally{setLoading(false)}}
 useEffect(()=>{load()},[category]);
 return <main className="container"><div className="page-head"><span className="eyebrow">THE INKWELL LIBRARY</span><h1>Explore stories.</h1><p className="muted">Find an idea that stays with you.</p></div><form className="search-bar" onSubmit={e=>{e.preventDefault();load()}}><input className="field" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search stories, topics, ideas…"/><button className="button button-dark"><Search size={16}/> Search</button></form><div className="category-row" style={{display:"flex",gap:9,flexWrap:"wrap",margin:"25px 0"}}>{categories.map(c=><button key={c} className={category===c?"button button-dark":"button button-outline"} onClick={()=>setCategory(c)}>{c}</button>)}</div>{loading?<p className="loading">Searching…</p>:posts.length?<div className="post-grid section" style={{paddingTop:10}}>{posts.map(p=><PostCard key={p._id} post={p}/>)}</div>:<p className="empty-note">No stories found. Try another search.</p>}</main>;
}
