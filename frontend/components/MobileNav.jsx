"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  Package,
  Bookmark,
  ShoppingBag,
} from "lucide-react";
import { getShoppingList } from "@/lib/shopping-list";
import ShoppingListModal from "./ShoppingListModal";

export default function MobileNav() {
  const pathname = usePathname();
  const [shoppingCount, setShoppingCount] = useState(0);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);

  const updateCount = () => {
    const list = getShoppingList();
    setShoppingCount(list.filter((i) => !i.completed).length);
  };

  useEffect(() => {
    updateCount();
    const handleUpdate = () => updateCount();
    if (typeof window !== "undefined") {
      window.addEventListener("servd-shopping-list-updated", handleUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("servd-shopping-list-updated", handleUpdate);
      }
    };
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Explore", icon: Home },
    { href: "/recipes", label: "Saved", icon: Bookmark },
    { href: "/pantry", label: "Pantry", icon: Package },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-orange-600 font-bold scale-105"
                  : "text-stone-500 hover:text-stone-900 font-medium"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        {/* Shopping List Trigger */}
        <button
          onClick={() => setIsShoppingOpen(true)}
          className="relative flex flex-col items-center gap-1 py-1 px-3 text-stone-500 hover:text-orange-600 font-medium cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {shoppingCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {shoppingCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Shop</span>
        </button>
      </div>

      <ShoppingListModal
        isOpen={isShoppingOpen}
        onClose={() => setIsShoppingOpen(false)}
      />
    </>
  );
}
