"use client";

import useFetch from "@/hooks/use-fetch";
import { ArrowLeft, Loader2, ChefHat } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import RecipeCard from "./RecipeCard";
import SearchFilterSort from "./SearchFilterSort";

const RecipeGrid = ({
  type, // category or cuisine
  value, // actual category/cuisine
  fetchAction, // server action to fetch meals
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
        <div>
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl md:text-6xl font-black text-stone-900 capitalize tracking-tight leading-tight">
            {displayName}{" "}
            <span className="text-orange-600">
              {type === "cuisine" ? "Cuisine" : "Recipes"}
            </span>
          </h1>
          {!loading && meals.length > 0 && (
            <p className="text-stone-600 mt-2 font-light text-base">
              Showing {filteredMeals.length} of {meals.length} delicious {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"}
            </p>
          )}
        </div>

        {/* Filter Controls */}
        <SearchFilterSort
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-stone-500 font-medium">Loading recipes...</p>
          </div>
        )}

        {/* Meals Grid */}
        {!loading && filteredMeals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMeals.map((meal) => (
              <RecipeCard key={meal.idMeal} recipe={meal} variant="grid" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMeals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200 p-8">
            <ChefHat className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              No recipes found
            </h3>
            <p className="text-stone-500 mb-6 font-light">
              We couldn&apos;t find any matching {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"}.
            </p>
            <Link
              href={backLink}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to explore more
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGrid;
