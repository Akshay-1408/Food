"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Bookmark,
  ShoppingBag,
} from "lucide-react";
import { getShoppingList } from "@/lib/shopping-list";
import ShoppingListModal from "./ShoppingListModal";
import { motion } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();
  const [shoppingCount, setShoppingCount] = useState(0);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const list = getShoppingList();
      setShoppingCount(list.filter((i) => !i.completed).length);
    };

    updateCount();
    window.addEventListener("servd-shopping-list-updated", updateCount);
    return () => {
      window.removeEventListener("servd-shopping-list-updated", updateCount);
    };
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Explore", icon: Home },
    { href: "/recipes", label: "Saved", icon: Bookmark },
    { href: "/pantry", label: "Pantry", icon: Package },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-stone-200/60 px-2 py-2 flex items-center justify-around shadow-2xl shadow-stone-900/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              whileTap={{ scale: 0.85 }}
              className="relative"
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                />
              )}

              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all relative"
              >
                {/* Active pill background */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-15"
                  />
                )}

                <Icon
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive ? "text-orange-600" : "text-stone-400"
                  }`}
                />
                <span
                  className={`text-[10px] relative z-10 transition-colors ${
                    isActive
                      ? "text-orange-600 font-bold"
                      : "text-stone-400 font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}

        {/* Shopping List Trigger */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setIsShoppingOpen(true)}
          className="relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl text-stone-400 hover:text-orange-600 font-medium cursor-pointer transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {shoppingCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-2 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
              >
                {shoppingCount}
              </motion.span>
            )}
          </div>
          <span className="text-[10px]">Shop</span>
        </motion.button>
      </div>

      <ShoppingListModal
        isOpen={isShoppingOpen}
        onClose={() => setIsShoppingOpen(false)}
      />
    </>
  );
}
