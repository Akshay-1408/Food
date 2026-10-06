import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 shadow-xs",
        outline:
          "border-2 border-stone-200 bg-white/90 hover:border-orange-500 hover:bg-orange-50/50 text-stone-800 hover:text-orange-600 shadow-xs",
        secondary:
          "bg-stone-900 text-white hover:bg-stone-800 shadow-sm border border-stone-800",
        ghost:
          "hover:bg-stone-200/60 hover:text-stone-900 text-stone-700",
        destructive:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white shadow-xs",
        primary: "bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white shadow-md shadow-orange-600/25 border border-orange-500/30 font-bold",
        dial: "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md shadow-orange-500/25 border border-white/20",
        emerald: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 border border-emerald-500/30 font-bold",
        amber: "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-500/25 border border-amber-400/40",
        link: "text-orange-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4 py-2 text-sm",
        xs: "h-7 gap-1 rounded-xl px-2.5 text-xs",
        sm: "h-8.5 gap-1.5 rounded-xl px-3 text-xs",
        lg: "h-12 gap-2.5 rounded-2xl px-6 text-base font-bold",
        xl: "h-14 rounded-2xl px-8 text-lg font-extrabold shadow-lg",
        icon: "size-10 rounded-2xl",
        "icon-xs": "size-7 rounded-xl",
        "icon-sm": "size-8 rounded-xl",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
