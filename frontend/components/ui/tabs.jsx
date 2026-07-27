"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      className={cn("w-full flex flex-col", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        "grid w-full grid-cols-2 rounded-lg bg-muted p-1",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
        "data-active:bg-white data-active:text-black data-active:shadow",
        "hover:bg-white/70",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Panel
      className={cn(
        "w-full mt-6 outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };