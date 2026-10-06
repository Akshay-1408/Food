import {
  getAreas,
  getCategories,
  getRecipeOfTheDay,
} from "@/actions/mealdb.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Flame, Globe, Sparkles, UtensilsCrossed, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getCategoryEmoji, getCountryFlag } from "@/lib/data";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import DashboardExplorer from "@/components/DashboardExplorer";

export default async function DashboardPage() {
  const recipeData = await getRecipeOfTheDay();
  const categoriesData = await getCategories();
  const areasData = await getAreas();

  const RecipeOfTheDay = recipeData?.recipe;
  const Categories = categoriesData?.categories || [];
  const Areas = areasData?.areas || [];

  return (
    <div className="min-h-screen bg-stone-50/60 pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white p-8 md:p-12 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-6 uppercase tracking-wider border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-200" />
              AI Powered Culinary Engine
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4 drop-shadow-xs">
              Fresh Recipes, <br className="hidden sm:block" /> Servd Daily.
            </h1>

            <p className="text-orange-100 text-lg md:text-xl font-light mb-8 max-w-xl">
              Turn your leftovers into culinary masterpieces. Explore world cuisines or generate custom recipes with AI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/pantry">
                <Button variant="secondary" size="lg" className="rounded-2xl gap-2 text-white">
                  <UtensilsCrossed className="w-5 h-5 text-orange-400" />
                  What Can I Cook?
                </Button>
              </Link>
              <Link href="/recipes">
                <Button variant="outline" size="lg" className="rounded-2xl border-white/40 bg-white/10 hover:bg-white/20 text-white gap-2">
                  <Heart className="w-5 h-5 text-red-300" />
                  Saved Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recently Viewed History */}
        <RecentlyViewedSection />

        {/* Recipe of the Day */}
        {RecipeOfTheDay && (
          <section className="relative">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-6 h-6 text-orange-600" />
              <h2 className="text-3xl font-black text-stone-900 tracking-tight">
                Recipe of the Day
              </h2>
            </div>

            <Link href={`/recipe?cook=${encodeURIComponent(RecipeOfTheDay.strMeal)}`}>
              <div className="relative bg-white rounded-3xl border border-stone-200 overflow-hidden hover:border-orange-500 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-4/3 md:aspect-auto bg-stone-100 min-h-[300px]">
                    <Image
                      src={RecipeOfTheDay.strMealThumb}
                      alt={RecipeOfTheDay.strMeal}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-600 text-white font-bold px-3 py-1 text-xs uppercase tracking-wider shadow-md">
                        Today&apos;s Special
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 font-bold">
                        {RecipeOfTheDay.strCategory}
                      </Badge>
                      <Badge variant="outline" className="border-stone-300 text-stone-700 font-bold flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-stone-500" />
                        {RecipeOfTheDay.strArea}
                      </Badge>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                      {RecipeOfTheDay.strMeal}
                    </h3>

                    <p className="text-stone-600 mb-8 line-clamp-3 font-light text-base md:text-lg">
                      {RecipeOfTheDay.strInstructions?.substring(0, 220)}...
                    </p>

                    <Button variant="dial" size="lg" className="w-fit rounded-2xl">
                      Start Cooking <ArrowRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Interactive Dashboard Explorer (Search, Filter, Categories & Cuisines) */}
        <DashboardExplorer categories={Categories} areas={Areas} />
      </div>
    </div>
  );
}
