"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isFavorite, toggleFavorite } from "@/lib/favorites-history";
import { addMultipleShoppingItems } from "@/lib/shopping-list";
import { toast } from "sonner";

export default function RecipeCard({ recipe, variant = "default" }) {
  const [fav, setFav] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Normalize recipe data
  const getRecipeData = () => {
    if (!recipe) return {};

    if (recipe.strMeal) {
      return {
        id: recipe.idMeal || recipe.strMeal,
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        category: recipe.strCategory || "",
        cuisine: recipe.strArea || "",
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }

    if (recipe.matchPercentage !== undefined) {
      return {
        id: recipe.id || recipe.title,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }

    return {
      id: recipe.id || recipe.documentId || recipe.title,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      cuisine: recipe.cuisine,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      image: recipe.imageUrl,
      href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
      showImage: !!recipe.imageUrl,
    };
  };

  const data = getRecipeData();

  useEffect(() => {
    if (data.title) {
      setFav(isFavorite(data.title));
    }
  }, [data.title]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavorite(recipe);
    setFav(updated);
    if (updated) {
      toast.success(`Saved "${data.title}" to favorites!`);
    } else {
      toast.info(`Removed "${data.title}" from favorites.`);
    }
  };

  const handleAddMissingToShoppingList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (data.missingIngredients && data.missingIngredients.length > 0) {
      addMultipleShoppingItems(data.missingIngredients, data.title);
      toast.success(`Added ${data.missingIngredients.length} missing items to Shopping List!`);
    }
  };

  // Variant: grid
  if (variant === "grid") {
    return (
      <Card className="rounded-3xl overflow-hidden border border-stone-200 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white cursor-pointer p-0 relative">
        <Link href={data.href || "#"} className="block">
          {/* Favorite Button Overlay */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-stone-600 hover:text-red-500 transition-transform active:scale-90"
            title={fav ? "Remove Favorite" : "Save Favorite"}
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Image */}
          <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
            {data.showImage && !imageError ? (
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 flex items-center justify-center">
                <ChefHat className="w-16 h-16 text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <CardHeader className="p-4">
            <CardTitle className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {data.title}
            </CardTitle>
          </CardHeader>
        </Link>
      </Card>
    );
  }

  // Variant: pantry (AI-generated match recommendations)
  if (variant === "pantry") {
    return (
      <Card className="rounded-3xl border border-stone-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col">
        {data.showImage && !imageError && (
          <div className="relative aspect-video bg-stone-100">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            {data.matchPercentage && (
              <div className="absolute top-4 right-4">
                <Badge
                  className={`${
                    data.matchPercentage >= 85
                      ? "bg-emerald-600"
                      : "bg-orange-600"
                  } text-white font-bold text-sm px-3 py-1 shadow-md`}
                >
                  {data.matchPercentage}% Match
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2 mb-2">
              {data.cuisine && (
                <Badge variant="outline" className="text-orange-600 border-orange-200 capitalize">
                  {data.cuisine}
                </Badge>
              )}
              {data.category && (
                <Badge variant="outline" className="text-stone-600 border-stone-200 capitalize">
                  {data.category}
                </Badge>
              )}
            </div>

            <button
              onClick={handleFavoriteClick}
              className="p-2 text-stone-400 hover:text-red-500 transition-transform active:scale-90"
            >
              <Heart className={`w-5 h-5 ${fav ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          <CardTitle className="text-2xl font-black text-stone-900 leading-tight">
            {data.title}
          </CardTitle>

          {data.description && (
            <CardDescription className="text-stone-600 text-sm mt-2 line-clamp-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-6 py-3 space-y-3 flex-1">
          {(data.prepTime || data.cookTime || data.servings) && (
            <div className="flex gap-4 text-xs font-semibold text-stone-500">
              {(data.prepTime || data.cookTime) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>{parseInt(data.prepTime || 0) + parseInt(data.cookTime || 0)} mins</span>
                </div>
              )}
              {data.servings && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>{data.servings} servings</span>
                </div>
              )}
            </div>
          )}

          {data.missingIngredients && data.missingIngredients.length > 0 && (
            <div className="p-3.5 bg-orange-50/80 border border-orange-200 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-orange-900">Missing Items:</span>
                <button
                  onClick={handleAddMissingToShoppingList}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3 h-3" /> Add to List
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.missingIngredients.map((item, i) => (
                  <Badge key={i} variant="outline" className="text-[11px] bg-white border-orange-200 text-orange-800">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-2">
          <Link href={data.href || "#"} className="w-full">
            <Button variant="emerald" className="w-full gap-2 rounded-2xl">
              <ChefHat className="w-4 h-4" /> Start Cooking
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Variant: list (saved recipes / list mode)
  return (
    <Card className="rounded-3xl border border-stone-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer group p-0">
      <Link href={data.href || "#"} className="flex flex-col sm:flex-row items-stretch">
        <div className="relative w-full sm:w-52 aspect-4/3 sm:aspect-auto shrink-0 bg-stone-100">
          {data.showImage && !imageError ? (
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, 208px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center min-h-[140px]">
              <ChefHat className="w-12 h-12 text-white/30" />
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex flex-wrap gap-1.5">
                {data.cuisine && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 capitalize">
                    {data.cuisine}
                  </Badge>
                )}
                {data.category && (
                  <Badge variant="outline" className="text-xs text-stone-600 border-stone-200 capitalize">
                    {data.category}
                  </Badge>
                )}
              </div>

              <button
                onClick={handleFavoriteClick}
                className="p-1 text-stone-400 hover:text-red-500 transition-transform active:scale-90"
              >
                <Heart className={`w-5 h-5 ${fav ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {data.title}
            </h3>

            {data.description && (
              <p className="text-xs text-stone-600 mt-1 line-clamp-2 font-light">
                {data.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs font-semibold text-stone-500 pt-3 border-t border-stone-100">
            <div className="flex gap-4">
              {(data.prepTime || data.cookTime) && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  {parseInt(data.prepTime || 0) + parseInt(data.cookTime || 0)} mins
                </span>
              )}
              {data.servings && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  {data.servings} serv
                </span>
              )}
            </div>

            <span className="text-orange-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}