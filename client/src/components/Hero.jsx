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
            {/* Ambient Backlight Glow behind the shield */}
            <div className="pointer-events-none absolute h-[360px] w-[360px] rounded-full bg-[#1ecfc1]/15 blur-[125px]" />
            <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full bg-blue-500/10 blur-[105px]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.28)_0%,rgba(255,241,184,0.16)_24%,rgba(30,207,193,0.1)_48%,transparent_74%)] blur-[18px]" />
              <div className="absolute h-[650px] w-[650px] rounded-full opacity-35 [background:repeating-conic-gradient(from_0deg,rgba(255,255,255,0.1)_0deg,rgba(255,255,255,0.1)_3deg,transparent_10deg,transparent_30deg)] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_68%)] blur-[1px] animate-[spin_36s_linear_infinite]" />
              <div className="absolute h-[430px] w-[430px] rounded-full border border-white/10 shadow-[0_0_70px_rgba(255,255,255,0.08),inset_0_0_70px_rgba(30,207,193,0.08)] blur-[0.5px]" />
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
