import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full text-center bg-white/90 backdrop-blur-sm p-10 rounded-3xl border border-stone-200 shadow-2xl shadow-stone-900/8 space-y-6 relative">
        {/* Glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-orange-200/30 to-transparent pointer-events-none" />

        <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-orange-200 shadow-sm">
          <svg
            className="w-12 h-12 text-orange-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
            <path d="M6 17h12" />
          </svg>
        </div>

        <div>
          <div className="text-7xl font-black text-stone-200 mb-1 leading-none select-none">404</div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
            Page Not Found
          </h1>
          <p className="text-stone-500 text-sm font-light leading-relaxed">
            We couldn&apos;t find the recipe or page you were looking for.
            Let&apos;s get you back to the kitchen!
          </p>
        </div>

        <div>
          <Link href="/dashboard" className="block">
            <Button variant="dial" size="lg" className="w-full gap-2 rounded-2xl font-bold">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
