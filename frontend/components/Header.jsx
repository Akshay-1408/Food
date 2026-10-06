import React from "react";
import { Button } from "./ui/button";
import { Cookie, Refrigerator, Sparkles, ShoppingBag, Flame } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import HowToCookModal from "./HowToCookModal";
import PricingModal from "./PricingModal";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import UserDropdown from "./UserDropdown";
import HeaderShoppingTrigger from "./HeaderShoppingTrigger";

export default async function Header() {
  const user = await checkUser();

  return (
    <header className="fixed top-0 w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-xl z-40 supports-backdrop-filter:bg-white/60 transition-all">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative flex items-center gap-2">
            <Image
              src="/orange-logo.png"
              alt="Servd Logo"
              width={48}
              height={48}
              className="w-12 h-12 group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Servd
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-stone-600">
          <Link
            href="/dashboard"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center px-3 py-1.5 rounded-xl hover:bg-orange-50/60"
          >
            <Flame className="w-4 h-4 text-orange-600" />
            Explore
          </Link>
          <Link
            href="/recipes"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center px-3 py-1.5 rounded-xl hover:bg-orange-50/60"
          >
            <Cookie className="w-4 h-4 text-amber-600" />
            Saved Recipes
          </Link>
          <Link
            href="/pantry"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center px-3 py-1.5 rounded-xl hover:bg-orange-50/60"
          >
            <Refrigerator className="w-4 h-4 text-emerald-600" />
            My Pantry
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Shopping List Trigger Client Component */}
          <HeaderShoppingTrigger />

          <HowToCookModal />

          <SignedIn>
            {/* Pricing Modal */}
            {user && (
              <PricingModal subscriptionTier={user.subscriptionTier}>
                <Badge
                  variant="outline"
                  className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    user.subscriptionTier === "pro"
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white border-none shadow-xs"
                      : "bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200"
                  }`}
                >
                  <Sparkles
                    className={`h-3 w-3 ${
                      user.subscriptionTier === "pro"
                        ? "text-white fill-white/20"
                        : "text-amber-500"
                    }`}
                  />
                  <span>
                    {user.subscriptionTier === "pro" ? "Pro Chef" : "Free Plan"}
                  </span>
                </Badge>
              </PricingModal>
            )}

            <UserDropdown />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-stone-700 hover:text-orange-600 hover:bg-orange-50 font-semibold text-sm"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="dial" className="rounded-2xl px-5 text-sm">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}