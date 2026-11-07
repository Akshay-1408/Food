"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { getShoppingList } from "@/lib/shopping-list";
import ShoppingListModal from "./ShoppingListModal";

export default function HeaderShoppingTrigger() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const list = getShoppingList();
      setCount(list.filter((i) => !i.completed).length);
    };

    updateCount();
    window.addEventListener("servd-shopping-list-updated", updateCount);
    return () => {
      window.removeEventListener("servd-shopping-list-updated", updateCount);
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="relative border-stone-200 text-stone-700 hover:text-orange-600 hover:border-orange-300 gap-1.5 rounded-2xl hidden sm:inline-flex"
      >
        <ShoppingBag className="w-4 h-4 text-orange-600" />
        <span className="font-semibold text-xs">Shopping</span>
        {count > 0 && (
          <span className="ml-1 bg-orange-600 text-white text-[10px] font-extrabold rounded-full px-1.5 py-0.2">
            {count}
          </span>
        )}
      </Button>

      <ShoppingListModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
