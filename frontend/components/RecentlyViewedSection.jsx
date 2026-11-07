"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, ChefHat, Trash2 } from "lucide-react";
import { getRecentlyViewed, clearRecentlyViewed } from "@/lib/favorites-history";
import { motion } from "framer-motion";

export default function RecentlyViewedSection() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      setHistory(getRecentlyViewed());
    };

    loadHistory();
    window.addEventListener("servd-history-updated", loadHistory);
    return () => {
      window.removeEventListener("servd-history-updated", loadHistory);
    };
  }, []);

  if (history.length === 0) return null;

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <History className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
            Recently Viewed
          </h2>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            clearRecentlyViewed();
            setHistory([]);
          }}
          className="text-xs text-stone-400 hover:text-red-500 font-semibold flex items-center gap-1 cursor-pointer transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {history.map((recipe, index) => (
          <motion.div
            key={recipe.id + "_" + recipe.title}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
          >
            <Link
              href={`/recipe?cook=${encodeURIComponent(recipe.title)}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200">
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-400"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                      <ChefHat className="w-8 h-8 text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-2.5">
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h4>
                  {recipe.cuisine && (
                    <span className="text-[10px] text-stone-400 font-medium capitalize">
                      {recipe.cuisine}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
