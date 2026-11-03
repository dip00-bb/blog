"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/client";
function Editor() {
 const router=useRouter(),params=useSearchParams(),editId=params.get("edit");
 const [form,setForm]=useState({title:"",excerpt:"",content:"",category:"Ideas",coverImage:"",tags:""});
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{if(editId)api<any>(`/api/posts/${editId}`).then(p=>setForm({title:p.title,excerpt:p.excerpt,content:p.content,category:p.category,coverImage:p.coverImage||"",tags:(p.tags||[]).join(", ")})).catch(e=>setError(e.message))},[editId]);
 function change(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>){setForm(f=>({...f,[e.target.name]:e.target.value}))}
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");try{const payload={...form,tags:form.tags.split(",").map(x=>x.trim()).filter(Boolean)};const p=await api<any>(editId?`/api/posts/${editId}`:"/api/posts",{method:editId?"PATCH":"POST",body:JSON.stringify(payload)});router.push(`/posts/${p.slug}`)}catch(e:any){setError(e.message)}finally{setBusy(false)}}
 return <main className="editor-wrap"><span className="eyebrow">THE WRITING DESK</span><h1>{editId?"Refine your story.":"A story begins here."}</h1><p className="muted">Take your time. Make it yours.</p><form className="editor-form" onSubmit={submit}>
 <label>Story title<input className="editor-input" name="title" value={form.title} onChange={change} placeholder="Give your story a thoughtful title…" required minLength={5} maxLength={120}/></label>
 <label>Short introduction<textarea className="editor-textarea" name="excerpt" value={form.excerpt} onChange={change} rows={2} placeholder="A short summary that invites people in…" required/></label>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><label>Category<select className="editor-input" name="category" value={form.category} onChange={change}>{["Ideas","Technology","Design","Culture","Lifestyle","Business"].map(x=><option key={x}>{x}</option>)}</select></label><label>Tags (comma separated)<input className="editor-input" name="tags" value={form.tags} onChange={change} placeholder="creativity, learning"/></label></div>
 <label>Cover image URL<input className="editor-input" name="coverImage" value={form.coverImage} onChange={change} placeholder="https://… (optional)"/></label>
 <label>Your story<textarea className="editor-textarea" name="content" value={form.content} onChange={change} rows={18} placeholder="Write something worth reading…" required minLength={30}/></label>
 {error&&<p className="error-text">{error}</p>}<div className="editor-actions"><Link href="/" className="share-link">Cancel</Link><button className="button button-dark" disabled={busy}>{busy?"Saving…":editId?"Save changes":"Publish story"}</button></div>
 </form></main>;
}
export default function WritePage(){return <Suspense fallback={<p className="loading">Opening editor…</p>}><Editor/></Suspense>}
