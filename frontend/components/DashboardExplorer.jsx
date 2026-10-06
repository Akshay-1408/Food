"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
          <h2 className="text-3xl font-black text-stone-900 mb-1 tracking-tight">
            Browse Categories
          </h2>
          <p className="text-stone-600 font-light text-base">
            Discover recipes curated for every mood & mealtime
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {filteredCategories.map((category) => (
            <Link
              key={category.strCategory}
              href={`/recipes/category/${category.strCategory.toLowerCase()}`}
            >
              <div className="bg-white p-5 rounded-3xl border border-stone-200 hover:border-orange-500 hover:shadow-lg transition-all text-center group cursor-pointer h-full flex flex-col items-center justify-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {getCategoryEmoji(category.strCategory)}
                </div>
                <h3 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors text-xs md:text-sm">
                  {category.strCategory}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse Cuisines */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-black text-stone-900 mb-1 tracking-tight">
            Explore World Cuisines
          </h2>
          <p className="text-stone-600 font-light text-base">
            Taste flavors from every corner of the globe
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAreas.map((area, index) => (
            <Link
              key={`${area.strArea}-${index}`}
              href={`/recipes/cuisine/${area.strArea
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <div className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-orange-500 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl flex items-center">
                    {getCountryFlag(area.strArea)}
                  </span>
                  <span className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors text-sm truncate">
                    {area.strArea}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
