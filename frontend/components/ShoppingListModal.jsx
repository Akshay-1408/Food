"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  Printer,
  CheckCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  getShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  removeShoppingItem,
  clearCompletedShoppingItems,
  clearAllShoppingItems,
} from "@/lib/shopping-list";
import { toast } from "sonner";
import { DialButton } from "./ui/dial-kit";

export default function ShoppingListModal({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const loadList = () => {
    setItems(getShoppingList());
  };

  useEffect(() => {
    if (isOpen) {
      loadList();
    }
    const handleUpdate = () => loadList();
    if (typeof window !== "undefined") {
      window.addEventListener("servd-shopping-list-updated", handleUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("servd-shopping-list-updated", handleUpdate);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addShoppingItem({
      name: newItemName,
      quantity: newItemAmount,
      category: "General",
    });

    setNewItemName("");
    setNewItemAmount("");
    toast.success("Item added to shopping list!");
  };

  const handleToggle = (id) => {
    toggleShoppingItem(id);
  };

  const handleRemove = (id) => {
    removeShoppingItem(id);
    toast.info("Item removed");
  };

  const handleClearCompleted = () => {
    clearCompletedShoppingItems();
    toast.success("Cleared completed items");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire shopping list?")) {
      clearAllShoppingItems();
      toast.info("Shopping list cleared");
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === "pending") return !item.completed;
    if (activeTab === "completed") return item.completed;
    return true;
  });

  const completedCount = items.filter((i) => i.completed).length;
  const pendingCount = items.length - completedCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Shopping List</h2>
              <p className="text-xs text-orange-100 font-medium">
                {pendingCount} remaining · {completedCount} completed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Input Form */}
        <form
          onSubmit={handleAddItem}
          className="p-4 bg-stone-50 border-b border-stone-200 flex gap-2"
        >
          <input
            type="text"
            placeholder="Add item (e.g. Olive Oil)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
          <input
            type="text"
            placeholder="Qty (optional)"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            className="w-24 px-3 py-2.5 bg-white border border-stone-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
          <DialButton type="submit" variant="dial" size="sm" icon={Plus}>
            Add
          </DialButton>
        </form>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-stone-100 flex items-center justify-between bg-white text-xs font-semibold text-stone-600">
          <div className="flex gap-1">
            {[
              { id: "all", label: `All (${items.length})` },
              { id: "pending", label: `To Buy (${pendingCount})` },
              { id: "completed", label: `Done (${completedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-100 text-orange-700 font-bold"
                    : "hover:bg-stone-100 text-stone-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="text-stone-400 hover:text-orange-600 font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Clear Done
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-stone-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30 text-stone-500" />
              <p className="font-medium text-stone-600 text-sm">No items found</p>
              <p className="text-xs text-stone-400">
                Add ingredients manually or from recipe detail pages!
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`pt-2 flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer group ${
                  item.completed
                    ? "bg-stone-50 text-stone-400 line-through opacity-70"
                    : "hover:bg-orange-50/60 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all ${
                      item.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-stone-300 group-hover:border-orange-500 bg-white"
                    }`}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5 font-bold" />}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 text-sm block">
                      {item.name}
                    </span>
                    {item.recipeTitle && (
                      <span className="text-[10px] text-orange-600 font-medium">
                        From: {item.recipeTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(item.amount || item.quantity) && (
                    <Badge variant="outline" className="text-xs border-stone-200 text-stone-600">
                      {item.amount || item.quantity}
                    </Badge>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
          <button
            onClick={handleClearAll}
            className="text-stone-400 hover:text-red-600 font-medium"
          >
            Clear All
          </button>
          <Button
            onClick={onClose}
            variant="primary"
            size="sm"
            className="rounded-2xl"
          >
            Done Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
