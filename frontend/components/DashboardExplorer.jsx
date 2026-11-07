"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SearchFilterSort from "./SearchFilterSort";
import { getCategoryEmoji, getCountryFlag } from "@/lib/data";

export default function DashboardExplorer({ categories = [], areas = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const name = (cat.strCategory || "").toLowerCase();
      const matchSearch = !searchTerm || name.includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === "all" || name === selectedCategory.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [categories, searchTerm, selectedCategory]);

  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const name = (area.strArea || "").toLowerCase();
      return !searchTerm || name.includes(searchTerm.toLowerCase());
    });
  }, [areas, searchTerm]);

  return (
    <div className="space-y-12">
      {/* Search & Filter Controls */}
      <SearchFilterSort
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Browse Categories */}
      <section>
        <div className="mb-6">
          <motion.h2
            className="text-3xl font-black text-stone-900 mb-1 tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Browse Categories
          </motion.h2>
          <motion.p
            className="text-stone-600 font-light text-base"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
          >
            Discover recipes curated for every mood &amp; mealtime
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {filteredCategories.map((category, index) => (
            <Link
              key={category.strCategory}
              href={`/recipes/category/${category.strCategory.toLowerCase()}`}
            >
              <motion.div
                className="relative bg-white p-5 rounded-3xl border border-stone-200 hover:border-orange-400 hover:shadow-lg transition-colors text-center group cursor-pointer h-full flex flex-col items-center justify-center overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                {/* Hover background tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="relative z-10 text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {getCategoryEmoji(category.strCategory)}
                </div>
                <h3 className="relative z-10 font-bold text-stone-900 group-hover:text-orange-600 transition-colors text-xs md:text-sm">
                  {category.strCategory}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse Cuisines */}
      <section>
        <div className="mb-6">
          <motion.h2
            className="text-3xl font-black text-stone-900 mb-1 tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Explore World Cuisines
          </motion.h2>
          <motion.p
            className="text-stone-600 font-light text-base"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
          >
            Taste flavors from every corner of the globe
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAreas.map((area, index) => (
            <Link
              key={`${area.strArea}-${index}`}
              href={`/recipes/cuisine/${area.strArea
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <motion.div
                className="relative bg-white p-4 rounded-2xl border border-stone-200 hover:border-orange-400 hover:shadow-md transition-colors group cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                {/* Hover background tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-xl flex items-center">
                    {getCountryFlag(area.strArea)}
                  </span>
                  <span className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors text-sm truncate">
                    {area.strArea}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
