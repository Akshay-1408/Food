/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Flame,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  Heart,
  ShoppingBag,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import {
  getOrGenerateRecipe,
  saveRecipeToCollection,
  removeRecipeFromCollection,
} from "@/actions/recipe.actions";
import { toast } from "sonner";
import Image from "next/image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RecipePDF } from "@/components/RecipePDF";
import { ClockLoader } from "react-spinners";
import ProLockedSection from "@/components/ProLockedSection";
import ServingsCalculator, { scaleAmount } from "@/components/ServingsCalculator";
import CookingTimer from "@/components/CookingTimer";
import { isFavorite, toggleFavorite, addRecentlyViewed } from "@/lib/favorites-history";
import { addMultipleShoppingItems } from "@/lib/shopping-list";
import { DialButton } from "@/components/ui/dial-kit";

function RecipeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recipeName = searchParams.get("cook");

  const [recipe, setRecipe] = useState(null);
  const [recipeId, setRecipeId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Servings multiplier state
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Get or generate recipe
  const {
    loading: loadingRecipe,
    data: recipeData,
    fn: fetchRecipe,
  } = useFetch(getOrGenerateRecipe);

  // Save to collection
  const {
    loading: saving,
    data: saveData,
    fn: saveToCollection,
  } = useFetch(saveRecipeToCollection);

  // Remove from collection
  const {
    loading: removing,
    data: removeData,
    fn: removeFromCollection,
  } = useFetch(removeRecipeFromCollection);

  // Fetch recipe on mount
  useEffect(() => {
    if (recipeName && !recipe) {
      const formData = new FormData();
      formData.append("recipeName", recipeName);
      fetchRecipe(formData);
    }
  }, [recipeName]);

  // Update recipe when data arrives
  useEffect(() => {
    if (recipeData?.success) {
      setRecipe(recipeData.recipe);
      setRecipeId(recipeData.recipeId);
      setIsSaved(recipeData.isSaved);
      setIsFav(isFavorite(recipeData.recipe.title));

      // Add to recently viewed history
      addRecentlyViewed(recipeData.recipe);

      if (recipeData.fromDatabase) {
        toast.success("Recipe loaded from database");
      } else {
        toast.success("New recipe generated and saved!");
      }
    }
  }, [recipeData]);

  // Handle save success
  useEffect(() => {
    if (saveData?.success) {
      if (saveData.alreadySaved) {
        toast.info("Recipe is already in your collection");
      } else {
        setIsSaved(true);
        toast.success("Recipe saved to your collection!");
      }
    }
  }, [saveData]);

  // Handle remove success
  useEffect(() => {
    if (removeData?.success) {
      setIsSaved(false);
      toast.success("Recipe removed from collection");
    }
  }, [removeData]);

  // Toggle save/unsave collection
  const handleToggleSave = async () => {
    if (!recipeId) return;
    const formData = new FormData();
    formData.append("recipeId", recipeId);

    if (isSaved) {
      await removeFromCollection(formData);
    } else {
      await saveToCollection(formData);
    }
  };

  // Toggle Favorite Heart
  const handleFavClick = () => {
    if (!recipe) return;
    const updated = toggleFavorite(recipe);
    setIsFav(updated);
    if (updated) toast.success("Saved to favorites!");
    else toast.info("Removed from favorites.");
  };

  // Add all ingredients to shopping list
  const handleAddAllToShoppingList = () => {
    if (!recipe || !recipe.ingredients) return;
    const items = recipe.ingredients.map((ing) => ({
      name: ing.item,
      amount: scaleAmount(ing.amount, servingMultiplier),
      category: ing.category || "General",
    }));
    addMultipleShoppingItems(items, recipe.title);
    toast.success(`Added ${items.length} ingredients to your Shopping List!`);
  };

  // Toggle ingredient checked state
  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // No recipe name in URL
  if (!recipeName) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <div className="bg-orange-50 w-20 h-20 border-2 border-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            No recipe specified
          </h2>
          <p className="text-stone-600 mb-6 font-light">
            Please select a recipe from the dashboard
          </p>
          <Link href="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loadingRecipe === null || loadingRecipe) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-20">
            <ClockLoader className="mx-auto mb-6" color="#ea580c" />
            <h2 className="text-3xl font-black text-stone-900 mb-2 tracking-tight">
              Crafting Your Recipe
            </h2>
            <p className="text-stone-600 font-light">
              Our AI chef is preparing detailed instructions for{" "}
              <span className="font-bold text-orange-600">{recipeName}</span>...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingRecipe === false && !recipe) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <div className="bg-red-50 w-20 h-20 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Failed to load recipe
          </h2>
          <p className="text-stone-600 mb-6 font-light">
            Something went wrong while loading the recipe. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
            <Button onClick={() => window.location.reload()} variant="primary">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const baseServings = recipe.servings ? parseInt(recipe.servings) : 4;
  const currentServings = Math.round(baseServings * servingMultiplier);

  return (
    <div className="min-h-screen bg-stone-50/60 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-6 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Title & Hero Section */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-stone-200 shadow-sm mb-8 relative overflow-hidden">
          {/* Image */}
          {recipe.imageUrl && (
            <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-8 bg-stone-100">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              {/* Favorite Heart Floating Button */}
              <button
                onClick={handleFavClick}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg text-stone-600 hover:text-red-500 transition-all active:scale-90"
              >
                <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.cuisine && (
              <Badge variant="outline" className="text-orange-600 border-orange-200 capitalize">
                {recipe.cuisine}
              </Badge>
            )}
            {recipe.category && (
              <Badge variant="outline" className="text-stone-600 border-stone-200 capitalize">
                {recipe.category}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight leading-tight">
            {recipe.title}
          </h1>

          <p className="text-lg text-stone-600 mb-6 font-light leading-relaxed">
            {recipe.description}
          </p>

          {/* Meta Bar */}
          <div className="flex flex-wrap gap-6 text-stone-600 mb-8 pt-4 border-t border-stone-100 text-sm font-semibold">
            {(recipe.prepTime || recipe.cookTime) && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>
                  {parseInt(recipe.prepTime || 0) + parseInt(recipe.cookTime || 0)} mins total
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span>{currentServings} servings</span>
            </div>
            {recipe.nutrition?.calories && (
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span>{recipe.nutrition.calories} cal / serving</span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3">
            <DialButton
              onClick={handleToggleSave}
              disabled={saving || removing}
              variant={isSaved ? "emerald" : "dial"}
              icon={isSaved ? BookmarkCheck : Bookmark}
            >
              {saving || removing ? "Updating..." : isSaved ? "Saved in Collection" : "Save to Collection"}
            </DialButton>

            <DialButton
              onClick={handleAddAllToShoppingList}
              variant="outline"
              icon={ShoppingBag}
            >
              Add to Shopping List
            </DialButton>

            <PDFDownloadLink
              document={<RecipePDF recipe={recipe} />}
              fileName={`${recipe.title.replace(/\s+/g, "-").toLowerCase()}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="gap-2 rounded-2xl" disabled={loading}>
                  <Download className="w-4 h-4" />
                  {loading ? "Preparing PDF..." : "Export PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Ingredients & Servings Calculator */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                  Ingredients
                </h2>
              </div>

              {/* Servings Adjuster */}
              <ServingsCalculator
                baseServings={baseServings}
                onServingsChange={(val, mult) => setServingMultiplier(mult)}
              />

              {/* Add Ingredients to Shopping List Quick Button */}
              <button
                onClick={handleAddAllToShoppingList}
                className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100/80 text-orange-700 text-xs font-bold rounded-2xl border border-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add All Items to Shopping List
              </button>

              {/* Categorized Ingredients List with Checkboxes */}
              <div className="space-y-6 pt-2">
                {Object.entries(
                  recipe.ingredients.reduce((acc, ing) => {
                    const cat = ing.category || "General";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(ing);
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <ul className="space-y-2.5">
                      {items.map((ing, i) => {
                        const globalIdx = `${category}_${i}`;
                        const isChecked = !!checkedIngredients[globalIdx];
                        const scaledAmt = scaleAmount(ing.amount, servingMultiplier);

                        return (
                          <li
                            key={i}
                            onClick={() => toggleIngredientCheck(globalIdx)}
                            className={`flex justify-between items-start gap-3 p-2.5 rounded-2xl transition-all cursor-pointer select-none ${
                              isChecked
                                ? "bg-emerald-50 text-stone-400 line-through opacity-70"
                                : "hover:bg-stone-50 text-stone-800"
                            }`}
                          >
                            <span className="text-sm font-medium flex-1">
                              {ing.item}
                            </span>
                            <span className="font-bold text-orange-600 text-xs whitespace-nowrap bg-orange-50 px-2 py-1 rounded-xl">
                              {scaledAmt}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Nutrition Breakdown */}
              {recipe.nutrition && (
                <div className="pt-6 border-t border-stone-200">
                  <h3 className="font-extrabold text-stone-900 mb-3 text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>Nutrition Breakdown</span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                      Per Serving
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-orange-50 p-3 rounded-2xl text-center border border-orange-100">
                      <div className="text-xl font-black text-orange-600">
                        {recipe.nutrition.calories}
                      </div>
                      <div className="text-[10px] text-stone-500 font-extrabold uppercase">
                        Calories
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100">
                      <div className="text-xl font-black text-stone-900">
                        {recipe.nutrition.protein}
                      </div>
                      <div className="text-[10px] text-stone-500 font-extrabold uppercase">
                        Protein
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100">
                      <div className="text-xl font-black text-stone-900">
                        {recipe.nutrition.carbs}
                      </div>
                      <div className="text-[10px] text-stone-500 font-extrabold uppercase">
                        Carbs
                      </div>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100">
                      <div className="text-xl font-black text-stone-900">
                        {recipe.nutrition.fat}
                      </div>
                      <div className="text-[10px] text-stone-500 font-extrabold uppercase">
                        Fat
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Step-by-Step Cooking Timer & Tips */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cooking Instructions with Timer */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-stone-900">
                Step-by-Step Instructions
              </h2>

              <CookingTimer instructions={recipe.instructions || []} />
            </div>

            {/* General Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-3xl border border-orange-200 shadow-xs">
                <h2 className="text-2xl font-black text-stone-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-orange-600 fill-orange-600" />
                  Chef&apos;s Tips & Tricks
                </h2>
                <ul className="space-y-3">
                  {recipe.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700 text-sm md:text-base font-light">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center py-20">
            <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-6" />
            <p className="text-stone-600 font-medium">Loading recipe...</p>
          </div>
        </div>
      }
    >
      <RecipeContent />
    </Suspense>
  );
}
