import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import ShieldContainer from "./ShieldContainer";
import { ShieldCheck, SearchCheck, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-28">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-7xl overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-10%] h-[400px] w-[500px] rounded-full bg-[#1ecfc1]/20 blur-[130px]" />
        <div className="absolute top-[10%] right-[-10%] h-[350px] w-[450px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >



            {/* Headline */}
            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              Detect job scams{" "}
              <span className="bg-gradient-to-r from-[#1ecfc1] via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                before you hit apply
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-gray-300 font-normal">
              Don't let deceptive recruitment traps compromise your career. LokerBuster validates metadata, detects linguistic anomalies, and verifies corporate registries in real time.
            </p>

            {/* Feature Trust Pills */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Ghost Company Vetting</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Advance-Fee Trap Detection</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Instant Risk Scoring</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Zero Resume Logging</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link to={user ? "/test" : "/login"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1ecfc1] text-gray-950 px-6 py-6 font-semibold text-base shadow-[0_0_25px_-5px_rgba(30,207,193,0.5)] hover:bg-[#1ecfc1]/90 hover:scale-[1.02] transition-all cursor-pointer">
                  <SearchCheck className="h-5 w-5" />
                  Launch Threat Scanner
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/community" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl border-white/15 bg-white/5 text-gray-200 px-6 py-6 font-medium text-base hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                  View Community Ledger
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 3D Shield */}
          <motion.div
            className="hidden lg:flex lg:col-span-5 relative items-center justify-center transform-gpu will-change-transform"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Ambient Backlight Glow behind the shield */}
            <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-[#1ecfc1]/20 blur-[100px]" />
            <div className="pointer-events-none absolute h-[240px] w-[240px] rounded-full bg-blue-500/15 blur-[80px]" />

            {/* 3D Shield Canvas */}
            <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center">
              <ShieldContainer />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;