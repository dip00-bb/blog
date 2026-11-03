"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, PenLine, Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { api } from "@/lib/client";
export function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { api("/api/auth/me").then(setUser).catch(() => setUser(null)); }, []);
  async function signOut() { await api("/api/auth/logout", { method: "POST" }); setUser(null); location.href = "/"; }
  return <header className="site-header"><div className="container nav-wrap">
    <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={18}/></span> inkwell<span className="brand-dot">.</span></Link>
    <nav className={open ? "nav-links nav-open" : "nav-links"}>
      <Link href="/#stories" onClick={() => setOpen(false)}>Discover</Link>
      <Link href="/#about" onClick={() => setOpen(false)}>About</Link>
      {user ? <><Link href="/library">My library</Link><Link href="/write" className="nav-write"><PenLine size={15}/> Write</Link><span className="nav-user">Hi, {user.name.split(" ")[0]}</span><button className="text-button" onClick={signOut}>Sign out</button></> : <><Link href="/login">Sign in</Link><Link href="/register" className="button button-dark nav-cta">Get started</Link></>}
    </nav>
    <div className="nav-actions"><ThemeToggle/><button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button></div>
  </div></header>;
}
