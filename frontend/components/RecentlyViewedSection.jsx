"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Clock, ChefHat, ArrowRight, Trash2 } from "lucide-react";
import { getRecentlyViewed, clearRecentlyViewed } from "@/lib/favorites-history";
import { Badge } from "./ui/badge";

export default function RecentlyViewedSection() {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    setHistory(getRecentlyViewed());
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    if (typeof window !== "undefined") {
      window.addEventListener("servd-history-updated", handleUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("servd-history-updated", handleUpdate);
      }
    };
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Recently Viewed Recipes
          </h2>
        </div>

        <button
          onClick={() => {
            clearRecentlyViewed();
            setHistory([]);
          }}
          className="text-xs text-stone-400 hover:text-red-500 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((recipe) => (
          <Link
            key={recipe.id + "_" + recipe.title}
            href={`/recipe?cook=${encodeURIComponent(recipe.title)}`}
            className="group"
          >
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-orange-500 hover:shadow-md transition-all duration-200">
              <div className="relative aspect-4/3 bg-stone-100">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-white/40" />
                  </div>
                )}
              </div>

              <div className="p-3">
                <h4 className="font-bold text-xs md:text-sm text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {recipe.title}
                </h4>
                {recipe.cuisine && (
                  <span className="text-[10px] text-stone-500 font-medium capitalize">
                    {recipe.cuisine}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
