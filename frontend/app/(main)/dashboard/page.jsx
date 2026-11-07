import {
  getAreas,
  getCategories,
  getRecipeOfTheDay,
} from "@/actions/mealdb.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import React from "react";
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
    <div className="relative min-h-screen bg-stone-50/60 pt-20 pb-20 px-4 overflow-x-hidden">
      {/* Subtle decorative grid pattern at the top of the page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v40H0zM40 0h1v40H0zM0 0v1h40V0zM0 40v1h40V0z' fill='%23000'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      {/* Radial gradient top-left accent */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-[700px] h-[500px] opacity-20"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at top left, #f97316 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-16 animate-fade-up">
        {/* ─── Hero Banner ─────────────────────────────────────────────── */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          {/* Gradient base */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500" />

          {/* Grid / dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            aria-hidden="true"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23fff'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />

          {/* Radial highlight top-right */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

          {/* Decorative ring */}
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full border border-white/10 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-6 uppercase tracking-wider border border-white/30 shadow-sm">
              <svg
                className="w-4 h-4 text-amber-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
              AI Powered Culinary Engine
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4 drop-shadow-sm text-white">
              Fresh Recipes,{" "}
              <br className="hidden sm:block" />
              <span className="text-amber-200">Servd Daily.</span>
            </h1>

            <p className="text-orange-100 text-lg md:text-xl font-light mb-8 max-w-xl leading-relaxed">
              Turn your leftovers into culinary masterpieces. Explore world
              cuisines or generate custom recipes with AI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/pantry">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-2xl gap-2 text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg
                    className="w-5 h-5 text-orange-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z" />
                    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
                    <path d="m2.1 21.8 6.4-6.3" />
                    <path d="m19 5-7 7" />
                  </svg>
                  What Can I Cook?
                </Button>
              </Link>
              <Link href="/recipes">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-white/40 bg-white/10 hover:bg-white/20 text-white gap-2 backdrop-blur-sm transition-all"
                >
                  <svg
                    className="w-5 h-5 text-red-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  Saved Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Recently Viewed ─────────────────────────────────────────── */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <RecentlyViewedSection />
        </div>

        {/* ─── Recipe of the Day ───────────────────────────────────────── */}
        {RecipeOfTheDay && (
          <section
            className="relative animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            {/* Section heading with gradient left-border accent */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-10 rounded-full bg-gradient-to-b from-orange-500 to-amber-400 shrink-0" />
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight">
                  Recipe of the Day
                </h2>
              </div>
              {/* Decorative gradient line */}
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
            </div>

            {/* Glow halo behind the card */}
            <div
              className="absolute inset-x-0 -inset-y-4 rounded-[2.5rem] pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 80%, rgba(251,146,60,0.18) 0%, transparent 70%)",
              }}
            />

            <Link
              href={`/recipe?cook=${encodeURIComponent(
                RecipeOfTheDay.strMeal
              )}`}
            >
              <div className="relative bg-white rounded-3xl border border-stone-200 overflow-hidden hover:border-orange-400 hover:shadow-[0_20px_60px_-10px_rgba(234,88,12,0.25)] transition-all duration-300 group cursor-pointer">
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
                    {/* image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-600 text-white font-bold px-3 py-1 text-xs uppercase tracking-wider shadow-md">
                        Today&apos;s Special
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-700 bg-orange-50 font-bold"
                      >
                        {RecipeOfTheDay.strCategory}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-stone-300 text-stone-700 font-bold flex items-center gap-1"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-stone-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                          <path d="M2 12h20" />
                        </svg>
                        {RecipeOfTheDay.strArea}
                      </Badge>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                      {RecipeOfTheDay.strMeal}
                    </h3>

                    <p className="text-stone-600 mb-8 line-clamp-3 font-light text-base md:text-lg leading-relaxed">
                      {RecipeOfTheDay.strInstructions?.substring(0, 220)}...
                    </p>

                    <Button
                      variant="dial"
                      size="lg"
                      className="w-fit rounded-2xl"
                    >
                      Start Cooking
                      <svg
                        className="w-5 h-5 ml-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ─── Interactive Dashboard Explorer ──────────────────────────── */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <DashboardExplorer categories={Categories} areas={Areas} />
        </div>
      </div>
    </div>
  );
}
