import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { DialControlPanel } from "@/components/ui/dial-kit";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Servd - AI Kitchen & Recipe Assistant",
  description:
    "Turn leftovers into culinary masterpieces with AI recipe suggestions, pantry scanning, and smart meal planning.",
};

const footerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recipes", label: "Saved" },
  { href: "/pantry", label: "Pantry" },
  { href: "/recipes", label: "Recipes" },
];

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} bg-stone-50 text-stone-900 antialiased selection:bg-orange-500 selection:text-white`}
        >
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <MobileNav />
          <DialControlPanel />
          <Toaster richColors position="top-right" />

          {/* Premium Footer */}
          <footer className="relative bg-white/80 backdrop-blur-sm text-stone-600">
            {/* Gradient top border */}
            <div className="h-px w-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400" />

            <div className="max-w-6xl mx-auto px-4 py-10">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

                {/* Left: Brand + tagline + copyright */}
                <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                  <ScrollToTop />
                  <p className="text-xs text-stone-500 font-light max-w-[200px] leading-relaxed">
                    Your AI-powered kitchen companion for smarter, tastier meals.
                  </p>
                  <p className="text-[11px] text-stone-400 font-medium mt-1">
                    © {new Date().getFullYear()} Servd AI. All rights reserved.
                  </p>
                </div>

                {/* Center: Nav links */}
                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                  {footerLinks.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="text-xs font-semibold text-stone-500 hover:text-orange-600 transition-colors uppercase tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Right: Made with love badge */}
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200/80 shadow-sm shadow-orange-100">
                    <span className="text-base leading-none">❤️</span>
                    <span className="text-xs font-bold text-orange-700 tracking-wide">
                      Made for food lovers
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  </div>
                  {/* Social icon row (decorative) */}
                  <div className="flex items-center gap-3">
                    {/* Twitter / X */}
                    <a
                      href="#"
                      aria-label="Twitter"
                      className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-orange-600 hover:border-orange-300 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-orange-600 hover:border-orange-300 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    {/* GitHub */}
                    <a
                      href="#"
                      aria-label="GitHub"
                      className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-orange-600 hover:border-orange-300 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
