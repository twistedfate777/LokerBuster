import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import ShieldContainer from "./ShieldContainer";
import { Check, ShieldCheck, ArrowRight, Sparkles, Zap, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1ecfc1]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy & Actions (7 cols) */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-[#1ecfc1]/40 text-xs text-[#1ecfc1] mb-6 shadow-[0_0_15px_rgba(30,207,193,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cyber Shield AI • Deteksi Loker Bodong #1 Indonesia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Lamar Kerja Tanpa Rasa Was-Was,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1ecfc1] via-teal-300 to-cyan-400 glow-text-cyan">
                Terlindungi AI.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Jangan biarkan impian karir Anda berujung pada penipuan tiket travel, biaya seragam fiktif, atau pencurian data KTP.{" "}
              <strong className="text-white font-semibold">LokerBuster AI</strong> memindai dan menganalisis setiap detail lowongan secara real-time.
            </p>

            {/* Heuristic #6: Feature Highlights Checklist */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Deteksi Modus Travel & Biaya Palsu</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Scam Score & Red Flags Instan</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Privasi Data 100% Terjaga</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Database Komunitas Terupdate</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <Link to={user ? "/test" : "/login"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#1ecfc1] text-gray-950 font-bold hover:bg-[#1ecfc1]/90 shadow-[0_0_25px_rgba(30,207,193,0.35)] px-7 py-6 text-base rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Scan Lowongan Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/community" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 px-6 py-6 text-base rounded-xl flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Lihat Riwayat Komunitas</span>
                </Button>
              </Link>
            </div>

            {/* Live Metrics Bar */}
            <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 w-full max-w-xl text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">15,420+</p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Lowongan Di-Scan</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#1ecfc1]">99.4%</p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Akurasi Deteksi</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">0 Biaya</p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">100% Gratis & Terbuka</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Cyber Shield Glass Container (5 cols) */}
          <motion.div
            className="lg:col-span-5 relative h-[380px] sm:h-[460px] lg:h-[540px] w-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Cyber Container Frame */}
            <div className="relative w-full h-full rounded-3xl cyber-glass-glow flex items-center justify-center p-2 overflow-hidden">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#1ecfc1] animate-ping" />
                <span>Interaktif 3D Cyber Shield</span>
              </div>
              <ShieldContainer />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
