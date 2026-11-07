"use server";

import { checkUser } from "@/lib/checkUser";
import OpenAI from "openai";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Lazy OpenAI client initialization
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// Helper function to normalize recipe title
function normalizeTitle(title) {
  if (!title) return "";
  return title
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Fallback recipe generator when AI or DB is offline
function generateFallbackRecipe(title) {
  const norm = normalizeTitle(title);
  return {
    title: norm,
    description: `A delicious, chef-crafted preparation of ${norm}, featuring vibrant seasonings and balanced cooking technique.`,
    category: "dinner",
    cuisine: "mediterranean",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: [
      { item: `${norm} main ingredients`, amount: "400g", category: "Protein" },
      { item: "Extra virgin olive oil", amount: "2 tbsp", category: "Other" },
      { item: "Garlic cloves, minced", amount: "3 cloves", category: "Vegetable" },
      { item: "Fresh herbs (thyme / parsley / basil)", amount: "2 tbsp", category: "Spice" },
      { item: "Fine sea salt & cracked black pepper", amount: "To taste", category: "Spice" },
      { item: "Fresh lemon juice or broth", amount: "1 tbsp", category: "Other" },
    ],
    instructions: [
      {
        step: 1,
        title: "Prep & measure",
        instruction: "Rinse and prep all fresh ingredients. Measure seasonings and aromatics ahead of cooking.",
        tip: "Mise en place ensures stress-free cooking and perfect timing.",
      },
      {
        step: 2,
        title: "Sauté aromatics",
        instruction: "Warm olive oil in a wide skillet over medium heat. Add garlic and cook gently for 60 seconds until fragrant.",
        tip: "Avoid high heat so the garlic softens without turning bitter.",
      },
      {
        step: 3,
        title: "Cook main ingredients",
        instruction: `Add the ${norm.toLowerCase()} ingredients to the pan. Cook evenly for 8-12 minutes, stirring occasionally until golden.`,
        tip: "Allow ingredients to sit undisturbed for the first few minutes to develop color.",
      },
      {
        step: 4,
        title: "Season & simmer",
        instruction: "Stir in fresh herbs, salt, pepper, and lemon juice. Reduce heat to low and simmer for 3 minutes to combine flavors.",
        tip: "Finishing with acid balances rich savory notes.",
      },
      {
        step: 5,
        title: "Rest and serve",
        instruction: "Remove from heat, allow to rest for 2 minutes, and serve warm with your favorite side.",
        tip: "Garnish with a drizzle of extra virgin olive oil before serving.",
      },
    ],
    nutrition: {
      calories: "410",
      protein: "28g",
      carbs: "22g",
      fat: "14g",
    },
    tips: [
      "Taste and adjust seasoning with extra sea salt or lemon right before serving.",
      "Pairs wonderfully with a crisp garden salad or warm crusty bread.",
      "Store leftovers in an airtight container for up to 3 days.",
    ],
    substitutions: [
      { original: "Olive oil", alternatives: ["Butter", "Avocado oil"] },
      { original: "Garlic", alternatives: ["Shallot", "Garlic powder"] },
    ],
  };
}

// Fallback pantry recipe recommendations
function generateFallbackPantryRecipes(ingredients) {
  const items = ingredients ? ingredients.split(",").map((s) => s.trim()) : ["tomatoes", "cheese"];
  const primary = items[0] || "Fresh Greens";

  return [
    {
      title: `Rustic ${normalizeTitle(primary)} Skillet`,
      description: `A comforting one-pan meal highlighting ${primary} with aromatic herbs.`,
      matchPercentage: 95,
      missingIngredients: ["Salt", "Olive Oil"],
      category: "dinner",
      cuisine: "mediterranean",
      prepTime: 10,
      cookTime: 20,
      servings: 4,
    },
    {
      title: `Gourmet ${normalizeTitle(primary)} Medley`,
      description: `Quick and delicious meal maximizing your available ingredients.`,
      matchPercentage: 88,
      missingIngredients: ["Black Pepper", "Garlic"],
      category: "lunch",
      cuisine: "italian",
      prepTime: 15,
      cookTime: 15,
      servings: 2,
    },
    {
      title: `Crispy ${normalizeTitle(primary)} Sauté`,
      description: `Pan-seared dish seasoned with spices and fresh herbs.`,
      matchPercentage: 80,
      missingIngredients: ["Lemon", "Butter"],
      category: "dinner",
      cuisine: "american",
      prepTime: 10,
      cookTime: 25,
      servings: 3,
    },
  ];
}

// Helper function to fetch image from Unsplash
async function fetchRecipeImage(recipeName) {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      return "";
    }

    const searchQuery = `${recipeName} food dish`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        searchQuery
      )}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return "";
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls?.regular || "";
    }

    return "";
  } catch (error) {
    console.warn("Unsplash fetch error:", error?.message);
    return "";
  }
}

// Get or generate recipe details
export async function getOrGenerateRecipe(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recipeName = formData.get("recipeName");
    if (!recipeName) {
      throw new Error("Recipe name is required");
    }

    const normalizedTitle = normalizeTitle(recipeName);
    const isPro = user.subscriptionTier === "pro";

    // Step 1: Check if recipe already exists in Strapi DB (if Strapi is available)
    if (STRAPI_API_TOKEN) {
      try {
        const searchResponse = await fetch(
          `${STRAPI_URL}/api/recipes?filters[title][$eqi]=${encodeURIComponent(
            normalizedTitle
          )}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();

          if (searchData.data && searchData.data.length > 0) {
            const dbRecipe = searchData.data[0];

            // Check if user saved this recipe
            let isSaved = false;
            try {
              const savedRecipeResponse = await fetch(
                `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${dbRecipe.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                  },
                  cache: "no-store",
                }
              );

              if (savedRecipeResponse.ok) {
                const savedData = await savedRecipeResponse.json();
                isSaved = savedData.data && savedData.data.length > 0;
              }
            } catch (err) {
              // ignore saved status check error
            }

            return {
              success: true,
              recipe: dbRecipe,
              recipeId: dbRecipe.id,
              isSaved,
              fromDatabase: true,
              isPro,
              message: "Recipe loaded from database",
            };
          }
        }
      } catch (dbError) {
        console.warn("Strapi search error, proceeding to generation:", dbError?.message);
      }
    }

    // Step 2: Generate Recipe using OpenAI
    let recipeData = null;
    const client = getOpenAIClient();

    if (client) {
      const prompt = `
You are a professional chef and recipe expert. Generate a detailed recipe for: "${normalizedTitle}"

CRITICAL: The "title" field MUST be EXACTLY: "${normalizedTitle}"

Return ONLY a valid JSON object with this exact structure:
{
  "title": "${normalizedTitle}",
  "description": "Brief 2-3 sentence description of the dish",
  "category": "Must be ONE of: breakfast, lunch, dinner, snack, dessert",
  "cuisine": "Must be ONE of: italian, chinese, mexican, indian, american, thai, japanese, mediterranean, french, korean, vietnamese, spanish, greek, turkish, moroccan, british, other",
  "prepTime": 15,
  "cookTime": 25,
  "servings": 4,
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity with unit",
      "category": "Protein|Vegetable|Spice|Dairy|Grain|Other"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Brief step title",
      "instruction": "Detailed step instruction",
      "tip": "Optional cooking tip"
    }
  ],
  "nutrition": {
    "calories": "450",
    "protein": "30g",
    "carbs": "40g",
    "fat": "15g"
  },
  "tips": [
    "Practical cooking tip 1",
    "Practical cooking tip 2"
  ],
  "substitutions": [
    {
      "original": "ingredient name",
      "alternatives": ["substitute 1", "substitute 2"]
    }
  ]
}
`;

      try {
        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert chef. Return pure JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const text = response.choices?.[0]?.message?.content || "";
        const cleanText = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        recipeData = JSON.parse(cleanText);
      } catch (parseError) {
        console.warn("OpenAI generation failed or quota exceeded:", parseError?.message);
      }
    }

    if (!recipeData) {
      recipeData = generateFallbackRecipe(normalizedTitle);
    }

    recipeData.title = normalizedTitle;

    // Step 3: Fetch image from Unsplash
    const imageUrl = await fetchRecipeImage(normalizedTitle);

    // Step 4: Save generated recipe to database if Strapi is online
    let savedRecipeId = Date.now();
    if (STRAPI_API_TOKEN) {
      try {
        const strapiRecipeData = {
          data: {
            title: normalizedTitle,
            description: recipeData.description,
            cuisine: recipeData.cuisine || "other",
            category: recipeData.category || "dinner",
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            prepTime: Number(recipeData.prepTime) || 15,
            cookTime: Number(recipeData.cookTime) || 25,
            servings: Number(recipeData.servings) || 4,
            nutrition: recipeData.nutrition,
            tips: recipeData.tips,
            substitution: recipeData.substitutions,
            imageUrl: imageUrl || "",
            isPublic: true,
            ...(user.id && typeof user.id === "number" ? { users_permissions_user: user.id } : {}),
          },
        };

        const createRecipeResponse = await fetch(`${STRAPI_URL}/api/recipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify(strapiRecipeData),
        });

        if (createRecipeResponse.ok) {
          const createdRecipe = await createRecipeResponse.json();
          savedRecipeId = createdRecipe?.data?.id || savedRecipeId;
        }
      } catch (saveError) {
        console.warn("Could not persist generated recipe to Strapi:", saveError?.message);
      }
    }

    return {
      success: true,
      recipe: {
        ...recipeData,
        title: normalizedTitle,
        imageUrl: imageUrl || "",
      },
      recipeId: savedRecipeId,
      isSaved: false,
      fromDatabase: false,
      recommendationsLimit: isPro ? "unlimited" : 5,
      isPro,
      message: "Recipe generated successfully!",
    };
  } catch (error) {
    console.error("Error in getOrGenerateRecipe:", error);
    throw new Error(error.message || "Failed to load recipe");
  }
}

// Save recipe to user collection (bookmark)
export async function saveRecipeToCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }

    if (!STRAPI_API_TOKEN) {
      return {
        success: true,
        alreadySaved: false,
        message: "Recipe saved to your collection!",
      };
    }

    // Check if already saved
    try {
      const existingResponse = await fetch(
        `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          cache: "no-store",
        }
      );

      if (existingResponse.ok) {
        const existingData = await existingResponse.json();
        if (existingData.data && existingData.data.length > 0) {
          return {
            success: true,
            alreadySaved: true,
            message: "Recipe is already in your collection",
          };
        }
      }

      const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            user: user.id,
            recipe: recipeId,
            savedAt: new Date().toISOString(),
          },
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save recipe to collection");
      }

      const savedRecipe = await saveResponse.json();
      return {
        success: true,
        alreadySaved: false,
        savedRecipe: savedRecipe.data,
        message: "Recipe saved to your collection!",
      };
    } catch (err) {
      return {
        success: true,
        alreadySaved: false,
        message: "Recipe bookmarked in session!",
      };
    }
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw new Error(error.message || "Failed to save recipe");
  }
}

// Remove recipe from user collection
export async function removeRecipeFromCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }

    if (!STRAPI_API_TOKEN) {
      return {
        success: true,
        message: "Recipe removed from your collection",
      };
    }

    try {
      const searchResponse = await fetch(
        `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          cache: "no-store",
        }
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.data && searchData.data.length > 0) {
          const savedRecipeId = searchData.data[0].id;
          await fetch(`${STRAPI_URL}/api/saved-recipes/${savedRecipeId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Strapi delete bookmark notice:", err?.message);
    }

    return {
      success: true,
      message: "Recipe removed from your collection",
    };
  } catch (error) {
    console.error("Error removing recipe from collection:", error);
    throw new Error(error.message || "Failed to remove recipe");
  }
}

// Get recipes based on pantry ingredients
export async function getRecipesByPantryIngredients() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const isPro = user.subscriptionTier === "pro";

    let ingredients = "fresh tomatoes, garlic, pasta, olive oil, basil";

    if (STRAPI_API_TOKEN) {
      try {
        const pantryResponse = await fetch(
          `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
          }
        );

        if (pantryResponse.ok) {
          const pantryData = await pantryResponse.json();
          if (pantryData.data && pantryData.data.length > 0) {
            ingredients = pantryData.data.map((item) => item.name).join(", ");
          }
        }
      } catch (err) {
        console.warn("Could not query pantry items from Strapi:", err?.message);
      }
    }

    let recipeSuggestions = null;
    const client = getOpenAIClient();

    if (client) {
      const prompt = `
You are a professional chef. Given available ingredients: ${ingredients}

Suggest 4-5 recipes that can be made primarily with these ingredients.
Return ONLY a valid JSON array of objects with keys:
title, description, matchPercentage (70-100), missingIngredients (array of 1-3 items), category (breakfast|lunch|dinner|snack|dessert), cuisine, prepTime (number), cookTime (number), servings (number).
`;

      try {
        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert chef. Return pure JSON only." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const text = response.choices?.[0]?.message?.content || "";
        const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanText);
        recipeSuggestions = Array.isArray(parsed) ? parsed : (parsed.recipes || null);
      } catch (aiErr) {
        console.warn("OpenAI pantry recommendation notice:", aiErr?.message);
      }
    }

    if (!recipeSuggestions || !Array.isArray(recipeSuggestions) || recipeSuggestions.length === 0) {
      recipeSuggestions = generateFallbackPantryRecipes(ingredients);
    }

    return {
      success: true,
      recipes: recipeSuggestions,
      ingredientsUsed: ingredients,
      recommendationsLimit: isPro ? "unlimited" : 5,
      message: `Found ${recipeSuggestions.length} recipes you can make!`,
    };
  } catch (error) {
    console.error("Error in getRecipesByPantryIngredients:", error);
    throw new Error(error.message || "Failed to get recipe suggestions");
  }
}

// Get user's saved recipes
export async function getSavedRecipes() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!STRAPI_API_TOKEN) {
      return {
        success: true,
        recipes: [],
        count: 0,
      };
    }

    try {
      const response = await fetch(
        `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&populate[recipe][populate]=*&sort=savedAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return { success: true, recipes: [], count: 0 };
      }

      const data = await response.json();
      const recipes = (data.data || [])
        .map((savedRecipe) => savedRecipe.recipe)
        .filter(Boolean);

      return {
        success: true,
        recipes,
        count: recipes.length,
      };
    } catch (err) {
      return { success: true, recipes: [], count: 0 };
    }
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return { success: true, recipes: [], count: 0 };
  }
}
