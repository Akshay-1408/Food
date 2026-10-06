import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { DialControlPanel } from "@/components/ui/dial-kit";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Servd - AI Kitchen & Recipe Assistant",
  description: "Turn leftovers into culinary masterpieces with AI recipe suggestions, pantry scanning, and smart meal planning.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ theme: neobrutalism }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-stone-50 text-stone-900 antialiased selection:bg-orange-500 selection:text-white`}>
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <MobileNav />
          <DialControlPanel />
          <Toaster richColors position="top-right" />
          <footer className="py-12 px-4 border-t border-stone-200 bg-white/60 text-stone-600">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-900">Servd AI</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </div>
              <p className="text-stone-500">
                Crafted with care for food lovers everywhere.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
