"use client";

import { PricingTable } from "@clerk/nextjs";
import React from "react";

const PricingSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black mb-3 text-stone-900 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-stone-600 font-light">
          Start for free. Upgrade anytime to become a master chef with unlimited AI scans.
        </p>
      </div>

      <div className="rounded-3xl border border-stone-200 overflow-hidden shadow-sm bg-white p-2">
        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PricingSection;
