import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Clock, Flame, Star, User, Sparkles, ChefHat, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FEATURES, HOW_IT_WORKS_STEPS, SITE_STATS } from "@/lib/data";
import PricingSection from "@/components/PricingSection";
import { DialButton } from "@/components/ui/dial-kit";

export default async function Home() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-6">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                #1 AI Cooking & Meal Prep Assistant
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.02] tracking-tight text-stone-950">
                Turn your{" "}
                <span className="italic bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  leftovers
                </span>{" "}
                into masterpieces.
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-xl mx-auto md:mx-0 font-light leading-relaxed">
                Snap a photo of your fridge or pantry. Servd AI instantly tells you what to cook.
                Save money, eliminate food waste, and enjoy delicious meals tonight.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link href="/dashboard">
                  <DialButton variant="dial" size="xl" icon={ArrowRight}>
                    Start Cooking Free
                  </DialButton>
                </Link>
                <Link href="/pantry">
                  <Button variant="outline" size="lg" className="rounded-3xl border-2 border-stone-300">
                    <ChefHat className="w-5 h-5 mr-2 text-orange-600" />
                    Scan My Pantry
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center md:justify-start gap-3 text-sm text-stone-500 font-medium">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold"
                    >
                      ★
                    </div>
                  ))}
                </div>
                <span>
                  Over <strong className="text-stone-900 font-bold">10,000+ home cooks</strong> joined this month
                </span>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl -z-10" />

              <div className="relative rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xl">
                <div className="relative aspect-4/3 sm:aspect-square">
                  <Image
                    src="/pasta-dish.png"
                    alt="Delicious pasta dish"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl p-4 shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-lg">
                        Rustic Tomato Basil Pasta
                      </h3>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1">
                      98% MATCH
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-stone-500 font-semibold pt-2 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-600" /> 25 mins
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-orange-600" /> 2 servings
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-stone-900 text-white border-y border-stone-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {SITE_STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-orange-400 mb-1">
                {stat.val}
              </div>
              <div className="text-stone-400 text-xs uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-stone-950 mb-4 tracking-tight">
              Your Complete AI Culinary Toolkit
            </h2>
            <p className="text-stone-600 text-lg font-light">
              Everything you need to master meal prep, reduce waste, and cook delicious food effortlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-3xl border border-stone-200 hover:border-orange-500 hover:shadow-xl transition-all group duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 text-orange-600 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs font-mono border-stone-200">
                      {feature.limit}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 font-light text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works 3 Steps */}
      <section className="py-24 px-4 bg-stone-900 text-white border-y border-stone-800">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Cook in 3 Easy Steps
            </h2>
            <p className="text-stone-400 font-light text-lg">
              From leftover groceries to a gourmet dinner in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((item, i) => (
              <div
                key={i}
                className="bg-stone-800/60 p-8 rounded-3xl border border-stone-700/60 relative"
              >
                <div className="text-4xl font-black text-orange-500 mb-4 font-mono">
                  {item.step}
                </div>
                <h3 className="text-xl font-extrabold mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingSection subscriptionTier={subscriptionTier} />
        </div>
      </section>
    </div>
  );
}
