"use client";

import React from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const featureVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.07,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

function FallbackPricingCards() {
  const freeFeatures = [
    "10 AI Pantry Scans per month",
    "5 AI Recipe Recommendations",
    "Interactive Cooking Timer",
    "Smart Grocery Shopping List",
    "World Cuisine & Category Explorer",
  ];

  const proFeatures = [
    { label: <><strong>Unlimited</strong> AI Fridge &amp; Pantry Scans</> },
    { label: <><strong>Unlimited</strong> Custom Recipe Generation</> },
    { label: "Full Nutritional Breakdown & Macros" },
    { label: "Chef Ingredient Substitutions" },
    { label: "PDF Cookbook Export & Printable Cards" },
    { label: "Priority AI response processing" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Free Plan */}
      <motion.div
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardVariants}
        className="rounded-3xl border border-stone-200 bg-stone-50/50 p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Starter
            </span>
            <Badge variant="outline" className="border-stone-300 text-stone-700">
              Active Plan
            </Badge>
          </div>
          <h3 className="text-2xl font-black text-stone-900 mb-1">Free Cook</h3>
          <div className="text-3xl font-black text-stone-900 mb-6">
            $0 <span className="text-sm font-normal text-stone-500">/ forever</span>
          </div>
          <ul className="space-y-3 text-sm text-stone-600">
            {freeFeatures.map((feature, i) => (
              <motion.li
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={featureVariants}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="mt-8 pt-4 border-t border-stone-200">
          <Button variant="outline" className="w-full rounded-2xl" disabled>
            Current Plan
          </Button>
        </div>
      </motion.div>

      {/* Pro Plan — animated gradient border wrapper */}
      <motion.div
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardVariants}
        className="relative"
      >
        {/* Animated gradient glow border */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-500 opacity-80 blur-[2px] animate-pulse" />
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-orange-500 via-amber-400 to-orange-600" />

        {/* Card inner */}
        <div className="relative rounded-[calc(1.5rem-1px)] border-0 bg-gradient-to-b from-orange-50/40 to-white p-6 flex flex-col justify-between shadow-lg shadow-orange-500/10 h-full">
          {/* Most Popular badge */}
          <div className="absolute -top-3 right-6">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs px-3 py-1 shadow-md uppercase tracking-wider">
                Most Popular
              </Badge>
            </motion.div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Culinary Master
              </span>
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-1">Pro Chef</h3>
            <div className="text-3xl font-black text-orange-600 mb-6">
              $9.99 <span className="text-sm font-normal text-stone-500">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-stone-700 font-medium">
              {proFeatures.map((feature, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={featureVariants}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-orange-600 shrink-0 font-bold" />
                  {feature.label}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-orange-100">
            <SignedIn>
              <Button
                variant="dial"
                className="w-full rounded-2xl font-bold shadow-md cursor-pointer"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/dashboard";
                  }
                }}
              >
                <Zap className="w-4 h-4 mr-1.5" /> Manage Subscription
              </Button>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  variant="dial"
                  className="w-full rounded-2xl font-bold shadow-md cursor-pointer"
                >
                  <Zap className="w-4 h-4 mr-1.5" /> Upgrade to Pro
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const PricingSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-stone-900 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base sm:text-lg text-stone-600 font-light">
          Start for free. Upgrade anytime to become a master chef with unlimited AI scans and advanced features.
        </p>
      </div>

      <FallbackPricingCards />
    </div>
  );
};

export default PricingSection;
