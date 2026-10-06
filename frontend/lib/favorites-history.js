"use client";

const FAVORITES_KEY = "servd_favorites_v1";
const HISTORY_KEY = "servd_recently_viewed_v1";

const notifyFavorites = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("servd-favorites-updated"));
  }
};

const notifyHistory = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("servd-history-updated"));
  }
};

// --- FAVORITES ---
export const getFavorites = () => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to parse favorites:", err);
    return [];
  }
};

export const isFavorite = (titleOrId) => {
  if (!titleOrId) return false;
  const favorites = getFavorites();
  const target = String(titleOrId).toLowerCase().trim();
  return favorites.some(
    (f) =>
      (f.id && String(f.id).toLowerCase() === target) ||
      (f.title && String(f.title).toLowerCase().trim() === target)
  );
};

export const toggleFavorite = (recipe) => {
  if (!recipe || (!recipe.title && !recipe.strMeal)) return false;
  const favorites = getFavorites();
  const title = recipe.title || recipe.strMeal;
  const id = recipe.id || recipe.idMeal || recipe.documentId || title;
  
  const targetKey = String(id).toLowerCase().trim();
  const existingIndex = favorites.findIndex(
    (f) =>
      (f.id && String(f.id).toLowerCase() === targetKey) ||
      (f.title && String(f.title).toLowerCase().trim() === String(title).toLowerCase().trim())
  );

  let newIsFavorite = false;
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    newIsFavorite = false;
  } else {
    favorites.unshift({
      id: id,
      title: title,
      image: recipe.imageUrl || recipe.strMealThumb || recipe.image || "",
      category: recipe.category || recipe.strCategory || "",
      cuisine: recipe.cuisine || recipe.strArea || "",
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      servings: recipe.servings || 2,
      savedAt: new Date().toISOString(),
    });
    newIsFavorite = true;
  }

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    notifyFavorites();
  } catch (err) {
    console.error("Failed to save favorites:", err);
  }

  return newIsFavorite;
};

// --- RECENTLY VIEWED HISTORY ---
export const getRecentlyViewed = () => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to parse recently viewed history:", err);
    return [];
  }
};

export const addRecentlyViewed = (recipe) => {
  if (!recipe || (!recipe.title && !recipe.strMeal)) return;
  const title = recipe.title || recipe.strMeal;
  const history = getRecentlyViewed();

  // Filter out existing occurrence of same title
  const filtered = history.filter(
    (h) => (h.title || "").toLowerCase().trim() !== title.toLowerCase().trim()
  );

  filtered.unshift({
    id: recipe.id || recipe.idMeal || recipe.documentId || title,
    title: title,
    image: recipe.imageUrl || recipe.strMealThumb || recipe.image || "",
    category: recipe.category || recipe.strCategory || "",
    cuisine: recipe.cuisine || recipe.strArea || "",
    prepTime: recipe.prepTime || 0,
    cookTime: recipe.cookTime || 0,
    servings: recipe.servings || 2,
    viewedAt: new Date().toISOString(),
  });

  // Limit to 12 items
  const trimmed = filtered.slice(0, 12);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    notifyHistory();
  } catch (err) {
    console.error("Failed to save history:", err);
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
    notifyHistory();
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
};
