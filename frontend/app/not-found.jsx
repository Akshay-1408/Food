"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-orange-600">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">
            Page Not Found
          </h1>
          <p className="text-stone-600 text-sm font-light">
            We couldn&apos;t find the recipe or page you were looking for.
          </p>
        </div>

        <Link href="/dashboard" className="block">
          <Button variant="primary" size="lg" className="w-full gap-2 rounded-2xl">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
