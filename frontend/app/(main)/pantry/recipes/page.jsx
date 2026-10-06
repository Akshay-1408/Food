"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  Loader2,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { getRecipesByPantryIngredients } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";
import PricingModal from "@/components/PricingModal";
import { DialButton } from "@/components/ui/dial-kit";

export default function PantryRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSuggestions,
  } = useFetch(getRecipesByPantryIngredients);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const recipes = recipesData?.recipes || [];
  const ingredientsUsed = recipesData?.ingredientsUsed || "";

  return (
    <div className="min-h-screen bg-stone-50/60 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/pantry"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pantry
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-emerald-100 rounded-3xl text-emerald-600">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
                What Can I Cook Today?
              </h1>
              <p className="text-stone-600 font-light text-sm md:text-base">
                AI-powered recipe recommendations matched to your pantry ingredients
              </p>
            </div>
          </div>

          {/* Ingredients Used Bar */}
          {ingredientsUsed && (
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-3">
              <Package className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-extrabold text-stone-900 text-sm mb-1">
                  Matched Ingredients:
                </h3>
                <p className="text-stone-600 text-sm font-light leading-relaxed">
                  {ingredientsUsed}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-6" />
            <h2 className="text-2xl font-black text-stone-900 mb-2">
              Finding Matching Recipes...
            </h2>
            <p className="text-stone-600 font-light">
              Our AI chef is analyzing your ingredients & calculating match percentages
            </p>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="text-2xl font-black text-stone-900">
                  Recommended Recipes
                </h2>
              </div>
              <Badge className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl">
                {recipes.length} matches found
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} variant="pantry" />
              ))}
            </div>

            {/* Refresh Suggestions */}
            <div className="pt-4 text-center">
              <DialButton
                onClick={() => fetchSuggestions(new FormData())}
                variant="dial"
                size="lg"
                icon={Sparkles}
                disabled={loading}
              >
                Get New AI Suggestions
              </DialButton>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && recipesData?.success === false && (
          <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-stone-200">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              Your Pantry is Empty
            </h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto font-light text-sm">
              Add ingredients to your pantry first so our AI chef can suggest delicious recipes you can cook!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pantry">
                <Button variant="primary" className="gap-2">
                  <Package className="w-4 h-4" /> Add Ingredients to Pantry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}