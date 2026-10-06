"use client";

import React, { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw, CheckCircle2, Lightbulb, BellRing } from "lucide-react";
import { DialButton } from "./ui/dial-kit";
import { toast } from "sonner";

export default function CookingTimer({ instructions = [] }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInitial, setTimerInitial] = useState(300); // default 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast.success("⏰ Timer Finished! Step time is up!", {
        duration: 8000,
      });
      // Play a subtle chime audio if available
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(() => {});
      } catch (err) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startQuickTimer = (minutes) => {
    const totalSecs = minutes * 60;
    setTimerInitial(totalSecs);
    setTimerSeconds(totalSecs);
    setIsTimerRunning(true);
    toast.info(`Started ${minutes} minute timer!`);
  };

  const toggleTimer = () => {
    if (timerSeconds === 0) {
      setTimerSeconds(timerInitial);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  const toggleStep = (stepNum) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const formatTimerTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent =
    instructions.length > 0
      ? Math.round(
          (Object.values(completedSteps).filter(Boolean).length /
            instructions.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Sticky Step Progress & Timer Panel */}
      <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-md flex flex-wrap gap-4 items-center justify-between">
        {/* Progress Bar */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-1.5">
            <span>Cooking Progress</span>
            <span className="text-orange-600">{progressPercent}% Completed</span>
          </div>
          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Live Countdown Timer Widget */}
        <div className="flex items-center gap-3 bg-stone-900 text-white px-4 py-2 rounded-2xl shadow-inner border border-stone-800">
          <Timer className={`w-5 h-5 ${isTimerRunning ? "text-orange-400 animate-spin" : "text-stone-400"}`} />
          <span className="font-mono text-lg font-black tracking-wider">
            {formatTimerTime(timerSeconds)}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTimer}
              className="p-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all active:scale-95"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1.5 text-stone-400 hover:text-white rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick preset timers */}
          <div className="hidden sm:flex items-center gap-1 border-l border-stone-800 pl-2">
            {[3, 5, 10, 15].map((m) => (
              <button
                key={m}
                onClick={() => startQuickTimer(m)}
                className="px-2 py-0.5 text-[10px] font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-all"
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step by Step List */}
      <div className="space-y-4">
        {instructions.map((step, index) => {
          const stepNum = step.step || index + 1;
          const isDone = !!completedSteps[stepNum];

          return (
            <div
              key={stepNum}
              onClick={() => toggleStep(stepNum)}
              className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer select-none group ${
                isDone
                  ? "bg-emerald-50/40 border-emerald-200 text-stone-500 opacity-80"
                  : "bg-white border-stone-200 hover:border-orange-400 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Check / Step Circle */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white border-2 border-emerald-700"
                      : "bg-orange-600 text-white border-2 border-orange-700 group-hover:scale-105"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold text-base md:text-lg ${isDone ? "line-through text-stone-500" : "text-stone-900"}`}>
                      {step.title || `Step ${stepNum}`}
                    </h3>
                    {step.time && (
                      <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                        {step.time}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm md:text-base leading-relaxed ${isDone ? "text-stone-400" : "text-stone-700 font-light"}`}>
                    {step.instruction}
                  </p>

                  {step.tip && (
                    <div className="mt-3 bg-amber-50/80 border-l-4 border-amber-500 p-3.5 rounded-r-2xl">
                      <p className="text-xs md:text-sm text-amber-900 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-bold">Pro Tip:</strong> {step.tip}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
