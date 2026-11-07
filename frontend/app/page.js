"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Flame, Star, User, Sparkles, ChefHat, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FEATURES, HOW_IT_WORKS_STEPS, SITE_STATS } from "@/lib/data";
import PricingSection from "@/components/PricingSection";
import { DialButton } from "@/components/ui/dial-kit";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                #1 AI Cooking &amp; Meal Prep Assistant
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.02] tracking-tight text-stone-950"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Turn your{" "}
                <span className="italic bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  leftovers
                </span>{" "}
                into masterpieces.
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-stone-600 mb-10 max-w-xl mx-auto md:mx-0 font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                Snap a photo of your fridge or pantry. Servd AI instantly tells you what to cook.
                Save money, eliminate food waste, and enjoy delicious meals tonight.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
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
              </motion.div>

              <motion.div
                className="mt-8 flex items-center justify-center md:justify-start gap-3 text-sm text-stone-500 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      ★
                    </motion.div>
                  ))}
                </div>
                <span>
                  Over <strong className="text-stone-900 font-bold">10,000+ home cooks</strong> joined this month
                </span>
              </motion.div>
            </motion.div>

            {/* Right Card Mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-stone-900 text-white border-y border-stone-800 relative overflow-hidden">
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/30 via-transparent to-amber-950/30 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4 relative">
          {SITE_STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-3xl md:text-4xl font-black text-orange-400 mb-1">
                {stat.val}
              </div>
              <div className="text-stone-400 text-xs uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-stone-950 mb-4 tracking-tight">
              Your Complete AI Culinary Toolkit
            </h2>
            <p className="text-stone-600 text-lg font-light">
              Everything you need to master meal prep, reduce waste, and cook delicious food effortlessly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    boxShadow: "0 20px 60px -10px rgba(249, 115, 22, 0.18)",
                  }}
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works 3 Steps */}
      <section className="py-24 px-4 bg-stone-900 text-white border-y border-stone-800">
        <div className="max-w-5xl mx-auto space-y-16">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Cook in 3 Easy Steps
            </h2>
            <p className="text-stone-400 font-light text-lg">
              From leftover groceries to a gourmet dinner in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[calc(16.667%+1rem)] right-[calc(16.667%+1rem)] h-px bg-gradient-to-r from-orange-500/30 via-amber-500/60 to-orange-500/30 z-0" />

            {HOW_IT_WORKS_STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-stone-800/60 p-8 rounded-3xl border border-stone-700/60 relative z-10"
              >
                <div className="text-4xl font-black text-orange-500 mb-4 font-mono">
                  {item.step}
                </div>
                <h3 className="text-xl font-extrabold mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingSection />
        </div>
      </section>
    </div>
  );
}
