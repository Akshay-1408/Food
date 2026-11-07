"use server";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

export async function getRecipeOfTheDay() {
  try {
    const res = await fetch(`${MEALDB_BASE}/random.php`, {
      next: { revalidate: 86400 }, // cache for 24 hours
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recipe of the day");
    }
    const data = await res.json();
    return {
      success: true,
      recipe: data?.meals?.[0] || null,
    };
  } catch (error) {
    console.error("Error fetching recipe of the day:", error);
    return {
      success: false,
      recipe: {
        idMeal: "52772",
        strMeal: "Teriyaki Chicken Casserole",
        strCategory: "Chicken",
        strArea: "Japanese",
        strInstructions:
          "Preheat oven to 350° F. In a bowl, combine soy sauce, mirin, brown sugar, and garlic. Marinate chicken, arrange with cooked rice, drizzle with sauce, and bake until bubbly and golden.",
        strMealThumb:
          "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      },
    };
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${MEALDB_BASE}/categories.php`, {
      next: { revalidate: 604808 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await res.json();
    return {
      success: true,
      categories: data?.categories || [],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      categories: [],
    };
  }
}

export async function getAreas() {
  try {
    const res = await fetch(`${MEALDB_BASE}/list.php?a=list`, {
      next: { revalidate: 604808 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch areas");
    }
    const data = await res.json();
    return {
      success: true,
      areas: data?.meals || [],
    };
  } catch (error) {
    console.error("Error fetching areas:", error);
    return {
      success: false,
      areas: [],
    };
  }
}

export async function getMealsByCategory(category) {
  try {
    const res = await fetch(
      `${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`,
      {
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch meals");
    }
    const data = await res.json();
    return {
      success: true,
      meals: data?.meals || [],
      category,
    };
  } catch (error) {
    console.error("Error fetching meals by category:", error);
    return {
      success: false,
      meals: [],
      category,
    };
  }
}

export async function getMealsByArea(area) {
  try {
    const res = await fetch(
      `${MEALDB_BASE}/filter.php?a=${encodeURIComponent(area)}`,
      {
        next: { revalidate: 86400 }, // cache for 24 hours
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch meals");
    }
    const data = await res.json();
    return {
      success: true,
      meals: data?.meals || [],
      area,
    };
  } catch (error) {
    console.error("Error fetching meals by areas:", error);
    return {
      success: false,
      meals: [],
      area,
    };
  }
}