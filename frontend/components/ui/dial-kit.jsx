"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Check, Sparkles } from "lucide-react";

/**
 * DialKit Interactive Controls Component Suite
 * Providing high-tactile feedback, spring micro-interactions, and visual polish.
 */

export function DialButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  active = false,
  disabled = false,
  className = "",
  type = "button",
  icon: Icon,
  ...props
}) {
  const [pressed, setPressed] = useState(false);

  const baseStyles =
    "relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-2xl gap-2 shadow-xs",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5 shadow-sm font-semibold",
    xl: "px-8 py-4 text-lg rounded-3xl gap-3 shadow-md font-bold",
    icon: "p-2.5 rounded-2xl aspect-square",
  };

  const variantStyles = {
    primary:
      "bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white shadow-orange-600/20 shadow-md hover:shadow-orange-600/30 border border-orange-500/30",
    emerald:
      "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/20 shadow-md hover:shadow-emerald-600/30 border border-emerald-500/30",
    secondary:
      "bg-stone-900 hover:bg-stone-800 active:bg-black text-white shadow-stone-900/10 border border-stone-800",
    outline:
      "bg-white/80 hover:bg-orange-50/80 active:bg-orange-100/80 text-stone-800 hover:text-orange-600 border-2 border-stone-200 hover:border-orange-400 backdrop-blur-xs",
    ghost:
      "bg-transparent hover:bg-stone-200/60 active:bg-stone-300/60 text-stone-700 hover:text-stone-900",
    dial:
      "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md shadow-orange-500/25 border border-white/20 active:scale-95",
    amber:
      "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold shadow-amber-500/25 shadow-md border border-amber-400/40",
  };

  const activeStyles = active
    ? "ring-2 ring-orange-500 ring-offset-1 bg-orange-50 text-orange-700 border-orange-500"
    : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${activeStyles}
        ${pressed ? "scale-95 translate-y-0.5" : "hover:-translate-y-0.5"}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
      {children}
    </button>
  );
}

export function DialToggle({
  checked = false,
  onChange,
  label = "",
  size = "md",
  className = "",
}) {
  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      <div
        onClick={() => onChange && onChange(!checked)}
        className={`relative rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
          checked
            ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-xs shadow-orange-500/30"
            : "bg-stone-300 hover:bg-stone-400"
        } ${size === "sm" ? "w-9 h-5" : "w-12 h-6.5"}`}
      >
        <div
          className={`bg-white rounded-full shadow-md transform transition-transform duration-200 ease-spring flex items-center justify-center ${
            size === "sm" ? "w-4 h-4" : "w-5.5 h-5.5"
          } ${
            checked
              ? size === "sm"
                ? "translate-x-4"
                : "translate-x-5.5"
              : "translate-x-0"
          }`}
        >
          {checked && (
            <Check
              className={`text-orange-600 font-bold ${
                size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
              }`}
            />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
          {label}
        </span>
      )}
    </label>
  );
}

export function DialSegmentedControl({
  options = [],
  value,
  onChange,
  className = "",
}) {
  return (
    <div
      className={`inline-flex p-1 bg-stone-200/80 backdrop-blur-md rounded-2xl border border-stone-300/60 shadow-inner overflow-x-auto max-w-full no-scrollbar ${className}`}
    >
      {options.map((opt) => {
        const isSelected =
          typeof opt === "object" ? opt.value === value : opt === value;
        const val = typeof opt === "object" ? opt.value : opt;
        const label = typeof opt === "object" ? opt.label : opt;
        const Icon = typeof opt === "object" ? opt.icon : null;

        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isSelected
                ? "bg-white text-orange-600 shadow-sm shadow-stone-900/10 font-bold scale-[1.02]"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/50"
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isSelected ? "text-orange-600" : "text-stone-500"}`} />}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DialSlider({
  value = 30,
  min = 5,
  max = 120,
  step = 5,
  onChange,
  label = "Max Cook Time",
  unit = "mins",
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center text-xs md:text-sm font-medium text-stone-700">
        <span>{label}</span>
        <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
          {value === max ? "Any time" : `≤ ${value} ${unit}`}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function DialBadge({
  children,
  variant = "orange",
  icon: Icon,
  className = "",
}) {
  const styles = {
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    stone: "bg-stone-100 text-stone-700 border-stone-200",
    pro: "bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white font-bold border-transparent shadow-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${
        styles[variant] || styles.orange
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

/**
 * DialKit Tuning Panel component for interactive dev parameter tuning.
 */
export function DialControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#ea580c");
  const [borderRadius, setBorderRadius] = useState(16);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-stone-900/95 text-stone-100 p-4 rounded-2xl shadow-2xl border border-stone-700 w-72 backdrop-blur-md text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-stone-800 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-orange-400">
              <Sliders className="w-4 h-4" /> DialKit Live Tuner
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
          <div>
            <label className="block text-stone-400 mb-1">Theme Accent</label>
            <div className="flex gap-2">
              {["#ea580c", "#10b981", "#8b5cf6", "#3b82f6"].map((c) => (
                <button
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 ${
                    primaryColor === c ? "border-white" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-stone-400 mb-1">Corner Radius ({borderRadius}px)</label>
            <input
              type="range"
              min="4"
              max="32"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
          <div className="pt-1 text-[10px] text-stone-500 flex justify-between">
            <span>DialKit 1.0</span>
            <span className="text-orange-400 font-medium">Ready</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-stone-900/90 text-orange-400 hover:text-orange-300 p-2.5 rounded-full border border-stone-700 shadow-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>DialKit</span>
        </button>
      )}
    </div>
  );
}
