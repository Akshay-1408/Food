"use client";

import React, { useState } from "react";
import PricingSection from "./PricingSection";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const PricingModal = ({ subscriptionTier = "free", children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const canOpen = subscriptionTier === "free";

  return (
    <Dialog open={isOpen} onOpenChange={canOpen ? setIsOpen : undefined}>
      <DialogTrigger render={children} />
      <DialogContent className="p-6 md:p-8 sm:max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Servd Pricing Plans</DialogTitle>
          <DialogDescription>
            Upgrade your plan to unlock unlimited AI features and Pro culinary tools.
          </DialogDescription>
        </DialogHeader>
        <PricingSection />
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
