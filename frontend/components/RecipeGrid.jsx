"use client";

import useFetch from "@/hooks/use-fetch";
import { ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import RecipeCard from "./RecipeCard";
import SearchFilterSort from "./SearchFilterSort";
import { motion } from "framer-motion";

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
      <div className="skeleton aspect-4/3 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

const RecipeGrid = ({
  type,
  value,
  fetchAction,
  backLink = "/dashboard",
}) => {
  const { data, loading, fn: fetchMeals } = useFetch(fetchAction);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (value) {
      const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
      fetchMeals(formattedValue);
    }
  }, [value]);

  const meals = data?.meals || [];
  const displayName = value?.replace(/-/g, " ");

  const filteredMeals = useMemo(() => {
    let list = meals.filter((m) => {
      const title = (m.strMeal || "").toLowerCase();
      return !searchTerm || title.includes(searchTerm.toLowerCase());
    });

    if (sortBy === "name_asc") {
      list.sort((a, b) => (a.strMeal || "").localeCompare(b.strMeal || ""));
    }

    return list;
  }, [meals, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-stone-50/60 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-5 font-semibold text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl md:text-6xl font-black text-stone-900 capitalize tracking-tight leading-tight">
            {displayName}{" "}
            <span className="gradient-text">
              {type === "cuisine" ? "Cuisine" : "Recipes"}
            </span>
          </h1>
          {!loading && meals.length > 0 && (
            <p className="text-stone-500 mt-2 font-light text-base">
              Showing{" "}
              <span className="font-semibold text-stone-700">{filteredMeals.length}</span>{" "}
              of {meals.length} delicious {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"}
            </p>
          )}
        </motion.div>

        {/* Filter Controls */}
        <SearchFilterSort
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
        />

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Meals Grid */}
        {!loading && filteredMeals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMeals.map((meal, index) => (
              <motion.div
                key={meal.idMeal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(index * 0.05, 0.4),
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <RecipeCard recipe={meal} variant="grid" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMeals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200 p-8"
          >
            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              No recipes found
            </h3>
            <p className="text-stone-500 mb-6 font-light">
              We couldn&apos;t find any matching {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"}.
            </p>
            <Link
              href={backLink}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to explore more
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipeGrid;
