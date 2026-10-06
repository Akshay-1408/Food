"use client";

import { useEffect, useState, useMemo } from "react";
import { Bookmark, Loader2, ChefHat, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { getSavedRecipes } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";
import SearchFilterSort from "@/components/SearchFilterSort";
import { getFavorites } from "@/lib/favorites-history";

export default function SavedRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  const [activeTab, setActiveTab] = useState("saved"); // "saved" | "favorites"
  const [localFavorites, setLocalFavorites] = useState([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxTime, setMaxTime] = useState(120);

  useEffect(() => {
    fetchSavedRecipes();
    setLocalFavorites(getFavorites());

    const handleFavUpdate = () => {
      setLocalFavorites(getFavorites());
    };
    if (typeof window !== "undefined") {
      window.addEventListener("servd-favorites-updated", handleFavUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("servd-favorites-updated", handleFavUpdate);
      }
    };
  }, []);

  const savedRecipes = recipesData?.recipes || [];
  const currentList = activeTab === "saved" ? savedRecipes : localFavorites;

  const filteredRecipes = useMemo(() => {
    return currentList.filter((recipe) => {
      const title = (recipe.title || recipe.strMeal || "").toLowerCase();
      const category = (recipe.category || recipe.strCategory || "").toLowerCase();

      const matchSearch = !searchTerm || title.includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === "all" || category === selectedCategory.toLowerCase();

      const prep = parseInt(recipe.prepTime || 0);
      const cook = parseInt(recipe.cookTime || 0);
      const totalTime = prep + cook;
      const matchTime = maxTime === 120 || totalTime === 0 || totalTime <= maxTime;

      return matchSearch && matchCat && matchTime;
    });
  }, [currentList, searchTerm, selectedCategory, maxTime]);

  return (
    <div className="min-h-screen bg-stone-50/60 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 rounded-3xl text-orange-600">
              <Bookmark className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
                My Cookbook
              </h1>
              <p className="text-stone-600 font-light text-sm md:text-base">
                Your personal collection of saved & favorite recipes
              </p>
            </div>
          </div>

          {/* Tab Controls */}
          <div className="inline-flex p-1.5 bg-stone-200/80 rounded-2xl border border-stone-300/60 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "saved"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Cloud ({savedRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "favorites"
                  ? "bg-white text-red-500 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              Favorites ({localFavorites.length})
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <SearchFilterSort
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onMaxTimeChange={setMaxTime}
        />

        {/* Loading State */}
        {loading && activeTab === "saved" && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-stone-600 font-medium">Loading your saved recipes...</p>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.documentId || recipe.id || index}
                recipe={recipe}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRecipes.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === "favorites" ? (
                <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              ) : (
                <Bookmark className="w-10 h-10 text-orange-600" />
              )}
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              {activeTab === "favorites"
                ? "No Favorite Recipes Yet"
                : "No Saved Recipes Found"}
            </h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto font-light">
              {activeTab === "favorites"
                ? "Tap the heart icon on any recipe to quickly save it to your favorites!"
                : "Start exploring recipes and bookmark your favorites to build your cookbook!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="primary" className="gap-2">
                  <ChefHat className="w-4 h-4" /> Explore Recipes
                </Button>
              </Link>
              <Link href="/pantry">
                <Button variant="outline" className="gap-2">
                  Check Your Pantry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
