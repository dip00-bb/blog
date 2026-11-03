"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Feather } from "lucide-react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/post-card";
import { api } from "@/lib/client";
import type { PostSummary } from "@/types";
export default function HomePage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api<{posts:PostSummary[]}>("/api/posts").then(d=>setPosts(d.posts)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  return <main><section className="container hero"><motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
    <span className="eyebrow">A HOME FOR GOOD IDEAS</span><h1>Stories that make<br/>you <em>think</em> a little<br/>differently.</h1>
    <p className="hero-copy">A quiet corner of the internet for curious minds. Discover thoughtful writing, share what you know, and find a fresh perspective.</p>
    <div className="hero-actions"><Link href="#stories" className="button button-dark">Explore stories <ArrowRight size={15}/></Link><Link href="/write" className="button button-outline"><Feather size={15}/> Start writing</Link></div>
  </motion.div><motion.div className="hero-art" initial={{opacity:0,rotate:2}} animate={{opacity:1,rotate:0}} transition={{duration:.8,delay:.2}}><div className="hero-paper"><div className="paper-kicker">THE ART OF NOTICING</div><div className="paper-title">Small things, big thoughts.</div><div className="paper-line"/><div className="paper-line"/><div className="paper-line" style={{width:"55%"}}/><div className="paper-note">“Pay attention. Be astonished. Tell about it.”</div></div><div className="floating-note">✳ &nbsp;Ideas live here</div></motion.div></section>
  <section className="container section" id="stories"><div className="section-top"><div><span className="eyebrow">FRESH FROM THE COMMUNITY</span><h2>Latest stories</h2></div><Link href="/explore" className="share-link">Explore all stories ↗</Link></div>
    {loading ? <p className="loading">Gathering stories…</p> : posts.length ? <div className="post-grid">{posts.map((p,i)=><PostCard key={p._id} post={p} featured={i===0}/>)}</div> : <div className="empty-note">No stories published yet. Be the first to share an idea. <Link href="/write">Write a story →</Link></div>}
  </section><section className="container" id="about"><div className="newsletter"><span className="eyebrow">YOUR WORDS MATTER</span><h2>Every good story starts somewhere.</h2><p>Have an idea worth sharing? Give it a place to live.</p><Link href="/write" className="button button-dark">Publish your first story <ArrowRight size={15}/></Link></div></section></main>;
}
