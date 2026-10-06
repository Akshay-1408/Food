"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, Heart, Clock, ArrowUpDown, X, Sparkles } from "lucide-react";
import { DialSegmentedControl, DialSlider, DialToggle, DialButton } from "./ui/dial-kit";

export default function SearchFilterSort({
  onSearchChange,
  onCategoryChange,
  onCuisineChange,
  onMaxTimeChange,
  onFavoritesOnlyChange,
  onSortChange,
  categories = [],
  cuisines = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [maxTime, setMaxTime] = useState(120);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleCategorySelect = (val) => {
    setSelectedCategory(val);
    if (onCategoryChange) onCategoryChange(val);
  };

  const handleCuisineSelect = (val) => {
    setSelectedCuisine(val);
    if (onCuisineChange) onCuisineChange(val);
  };

  const handleTimeChange = (val) => {
    setMaxTime(val);
    if (onMaxTimeChange) onMaxTimeChange(val);
  };

  const handleFavToggle = (val) => {
    setFavoritesOnly(val);
    if (onFavoritesOnlyChange) onFavoritesOnlyChange(val);
  };

  const handleSortSelect = (val) => {
    setSortBy(val);
    if (onSortChange) onSortChange(val);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedCuisine("all");
    setMaxTime(120);
    setFavoritesOnly(false);
    setSortBy("default");

    if (onSearchChange) onSearchChange("");
    if (onCategoryChange) onCategoryChange("all");
    if (onCuisineChange) onCuisineChange("all");
    if (onMaxTimeChange) onMaxTimeChange(120);
    if (onFavoritesOnlyChange) onFavoritesOnlyChange(false);
    if (onSortChange) onSortChange("default");
  };

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedCuisine !== "all" ? 1 : 0) +
    (maxTime < 120 ? 1 : 0) +
    (favoritesOnly ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({
      value: (c.strCategory || c).toLowerCase(),
      label: c.strCategory || c,
    })),
  ];

  const sortOptions = [
    { value: "default", label: "Recommended" },
    { value: "time_asc", label: "Fastest First" },
    { value: "name_asc", label: "A - Z" },
    { value: "fav_first", label: "Favorites" },
  ];

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4 mb-8">
      {/* Top Search Bar Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search recipes by name, ingredient, cuisine..."
            className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                if (onSearchChange) onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Toggle Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <DialToggle
            checked={favoritesOnly}
            onChange={handleFavToggle}
            label="Favorites"
          />

          <DialButton
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters || activeFilterCount > 0 ? "dial" : "outline"}
            size="md"
            icon={SlidersHorizontal}
          >
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-white text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </DialButton>
        </div>
      </div>

      {/* Expandable Advanced Controls */}
      {showFilters && (
        <div className="pt-4 border-t border-stone-100 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Category Dial */}
          {categories.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Category
              </span>
              <DialSegmentedControl
                options={categoryOptions.slice(0, 8)}
                value={selectedCategory}
                onChange={handleCategorySelect}
              />
            </div>
          )}

          {/* Sort & Time Row */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Sort Control */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" /> Sort By
              </span>
              <DialSegmentedControl
                options={sortOptions}
                value={sortBy}
                onChange={handleSortSelect}
              />
            </div>

            {/* Max Cook Time Slider */}
            <div>
              <DialSlider
                value={maxTime}
                min={10}
                max={120}
                step={5}
                onChange={handleTimeChange}
                label="Maximum Preparation Time"
              />
            </div>
          </div>

          {/* Reset Filters Bar */}
          {activeFilterCount > 0 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Reset all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
