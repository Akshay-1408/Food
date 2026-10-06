"use client";

import React, { useState } from "react";
import { Users, Minus, Plus, RefreshCw } from "lucide-react";
import { DialButton } from "./ui/dial-kit";

/**
 * Parses and scales ingredient quantities dynamically
 */

export function scaleAmount(amountStr, multiplier) {
  if (!amountStr || typeof amountStr !== "string") return amountStr;
  if (multiplier === 1) return amountStr;

  // Match leading numbers or fractions e.g. "1 1/2 cups", "2 tbsp", "1/4 tsp", "250g"
  const regex = /^([\d\s\/\.,]+)(.*)$/;
  const match = amountStr.trim().match(regex);

  if (!match) return amountStr;

  const numPart = match[1].trim();
  const rest = match[2];

  let val = parseFraction(numPart);

  if (isNaN(val) || val === 0) return amountStr;

  const scaled = val * multiplier;
  return `${formatScaledNumber(scaled)}${rest}`;
}

function parseFraction(str) {
  if (!str) return NaN;
  if (str.includes("/")) {
    const parts = str.split(" ");
    if (parts.length === 2) {
      const whole = parseFloat(parts[0]);
      const fracParts = parts[1].split("/");
      return whole + parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    } else {
      const fracParts = str.split("/");
      return parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    }
  }
  return parseFloat(str);
}

function formatScaledNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  // Rounded to 2 decimals max, stripped trailing zeros
  const rounded = Math.round(num * 100) / 100;
  return rounded.toString();
}

export default function ServingsCalculator({ baseServings = 4, onServingsChange }) {
  const [servings, setServings] = useState(baseServings);

  const updateServings = (newServings) => {
    const val = Math.max(1, Math.min(24, newServings));
    setServings(val);
    if (onServingsChange) {
      onServingsChange(val, val / baseServings);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-stone-100/80 rounded-2xl border border-stone-200 text-stone-800">
      <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
        <Users className="w-4 h-4 text-orange-600" />
        <span>Servings:</span>
      </div>

      <div className="flex items-center gap-2">
        <DialButton
          onClick={() => updateServings(servings - 1)}
          variant="outline"
          size="sm"
          disabled={servings <= 1}
          className="w-8 h-8 !p-0 rounded-xl"
        >
          <Minus className="w-3.5 h-3.5" />
        </DialButton>

        <span className="w-8 text-center font-bold text-orange-600 text-sm md:text-base">
          {servings}
        </span>

        <DialButton
          onClick={() => updateServings(servings + 1)}
          variant="outline"
          size="sm"
          disabled={servings >= 24}
          className="w-8 h-8 !p-0 rounded-xl"
        >
          <Plus className="w-3.5 h-3.5" />
        </DialButton>

        {servings !== baseServings && (
          <button
            onClick={() => updateServings(baseServings)}
            title="Reset to default"
            className="p-1.5 text-stone-400 hover:text-orange-600 rounded-lg transition-colors ml-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
