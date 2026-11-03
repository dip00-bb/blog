import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
export const metadata: Metadata = {
  title: "Inkwell — Stories worth staying for",
  description: "A thoughtful space for ideas, stories and perspectives."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><Providers><Header/>{children}<footer className="footer"><div className="container footer-inner"><span>© {new Date().getFullYear()} Inkwell. Made for curious minds.</span><span>Read deeply. Write honestly.</span></div></footer></Providers></body></html>;
}
