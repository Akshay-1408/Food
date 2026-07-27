"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal(props) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "-translate-x-1/2 -translate-y-1/2",
          "w-[95vw] max-w-lg",
          "max-h-[90vh] overflow-y-auto",
          "rounded-xl bg-white shadow-2xl",
          "p-6",
          "duration-200",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              />
            }
          >
            <XIcon className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-left",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-2xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};