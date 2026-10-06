"use client";

const SHOPPING_LIST_KEY = "servd_shopping_list_v1";

// Helper to notify listeners of changes
const notifyListeners = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("servd-shopping-list-updated"));
  }
};

export const getShoppingList = () => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SHOPPING_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to parse shopping list:", err);
    return [];
  }
};

export const addShoppingItem = (item) => {
  if (!item || !item.name) return;
  const list = getShoppingList();
  
  // Check if item already exists (case-insensitive)
  const existingIndex = list.findIndex(
    (i) => i.name.toLowerCase().trim() === item.name.toLowerCase().trim()
  );

  if (existingIndex > -1) {
    // Update quantity / mark uncompleted
    list[existingIndex] = {
      ...list[existingIndex],
      quantity: item.quantity || list[existingIndex].quantity,
      completed: false,
      recipeTitle: item.recipeTitle || list[existingIndex].recipeTitle,
    };
  } else {
    list.unshift({
      id: "shop_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      name: item.name.trim(),
      amount: item.amount || item.quantity || "",
      category: item.category || "General",
      recipeTitle: item.recipeTitle || "",
      completed: false,
      addedAt: new Date().toISOString(),
    });
  }

  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
    notifyListeners();
  } catch (err) {
    console.error("Failed to save shopping item:", err);
  }
};

export const addMultipleShoppingItems = (items, recipeTitle = "") => {
  if (!Array.isArray(items) || items.length === 0) return;
  const list = getShoppingList();

  items.forEach((item) => {
    const itemName = typeof item === "string" ? item : item.item || item.name;
    const amount = typeof item === "object" ? item.amount || item.quantity : "";
    const category = typeof item === "object" ? item.category : "General";

    if (!itemName) return;

    const existingIndex = list.findIndex(
      (i) => i.name.toLowerCase().trim() === itemName.toLowerCase().trim()
    );

    if (existingIndex > -1) {
      list[existingIndex] = {
        ...list[existingIndex],
        completed: false,
        amount: amount || list[existingIndex].amount,
        recipeTitle: recipeTitle || list[existingIndex].recipeTitle,
      };
    } else {
      list.push({
        id: "shop_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: itemName.trim(),
        amount: amount,
        category: category || "General",
        recipeTitle: recipeTitle,
        completed: false,
        addedAt: new Date().toISOString(),
      });
    }
  });

  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
    notifyListeners();
  } catch (err) {
    console.error("Failed to save shopping items:", err);
  }
};

export const toggleShoppingItem = (id) => {
  const list = getShoppingList();
  const updated = list.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updated));
    notifyListeners();
  } catch (err) {
    console.error("Failed to toggle shopping item:", err);
  }
};

export const removeShoppingItem = (id) => {
  const list = getShoppingList();
  const updated = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updated));
    notifyListeners();
  } catch (err) {
    console.error("Failed to remove shopping item:", err);
  }
};

export const clearCompletedShoppingItems = () => {
  const list = getShoppingList();
  const updated = list.filter((item) => !item.completed);
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updated));
    notifyListeners();
  } catch (err) {
    console.error("Failed to clear completed items:", err);
  }
};

export const clearAllShoppingItems = () => {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify([]));
    notifyListeners();
  } catch (err) {
    console.error("Failed to clear shopping list:", err);
  }
};
