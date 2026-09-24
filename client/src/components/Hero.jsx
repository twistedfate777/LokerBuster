import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import masRusdi from "@/assets/masRusdi.png";
import { SearchCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function Hero() {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const imageX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const imageY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(pointerY * -10);
    rotateY.set(pointerX * 10);
    imageX.set(pointerX * 10);
    imageY.set(pointerY * 10);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imageX.set(0);
    imageY.set(0);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-28">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle high-tech grid with radial fade */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_30%,transparent_100%)] opacity-70" />

        {/* Top-center soft conic/radial ambient bloom */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(30,207,193,0.16)_0%,rgba(14,165,233,0.08)_40%,transparent_70%)] blur-[120px]" />

        {/* Left side soft glow for typography */}
        <div className="absolute top-[5%] -left-[10%] h-[420px] w-[500px] rounded-full bg-[#1ecfc1]/10 blur-[140px]" />

        {/* Right side glow supporting mascot */}
        <div className="absolute top-[8%] -right-[5%] h-[480px] w-[560px] rounded-full bg-cyan-500/10 blur-[150px]" />
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
              Review job text or screenshots for suspicious language, unrealistic offers, and upfront-payment requests. Results are AI-generated risk estimates, not independent employer verification.
            </p>

            {/* Feature Trust Pills */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Language Pattern Review</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Upfront-Payment Signals</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">AI Risk Estimates</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-[#1ecfc1] shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300">Text + Screenshot Scans</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link to="/test" className="w-full sm:w-auto">
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

          {/* Right Column: Interactive 2D Shield */}
          <motion.div
            className="hidden lg:flex lg:col-span-5 relative items-center justify-center transform-gpu will-change-transform"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Ambient Backlight Glow behind the mascot */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Outer soft diffuse aurora */}
              <div className="absolute h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(30,207,193,0.18)_0%,rgba(14,165,233,0.1)_40%,rgba(99,102,241,0.04)_65%,transparent_80%)] blur-[60px]" />

              {/* Pulsing inner cyber core */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0.95, 0.7] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(30,207,193,0.32)_0%,rgba(56,189,248,0.16)_45%,transparent_70%)] blur-[40px]"
              />

              {/* Faint rotating tech ring */}
              <div className="absolute h-[460px] w-[460px] rounded-full border border-teal-400/15 [border-style:dashed] animate-[spin_70s_linear_infinite]" />

              {/* Elegant luminous orbit ring */}
              <div className="absolute h-[380px] w-[380px] rounded-full border border-white/10 shadow-[0_0_40px_rgba(30,207,193,0.14),inset_0_0_25px_rgba(30,207,193,0.06)]" />

              {/* Breathing shield wave */}
              <motion.div
                animate={{ scale: [0.93, 1.03, 0.93], opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-[310px] w-[310px] rounded-full border border-[#1ecfc1]/25"
              />

              {/* Grounding pedestal glow beneath mascot */}
              <div className="absolute -bottom-3 h-[24px] w-[300px] rounded-[100%] bg-gradient-to-r from-transparent via-[#1ecfc1]/35 to-transparent blur-md" />
            </div>

            {/* Interactive 2D image */}
            <div
              className="relative w-full aspect-square max-w-[460px] flex items-center justify-center"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <motion.img
                src={masRusdi}
                alt="LokerBuster shield protection"
                className="relative z-10 w-full max-w-[460px] object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.45)]"
                style={{ rotateX, rotateY, x: imageX, y: imageY, transformPerspective: 900 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
