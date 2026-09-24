import React, { useState } from "react";
import { motion } from "framer-motion";
import ScaleArchitectureDiagram from "./ScaleArchitectureDiagram";
import { works } from "@/constants";
import {
  FileInput,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  SearchCheck,
  RotateCcw,
} from "lucide-react";

const STEP_THEMES = [
  {
    // Node 01: Data Entry / Job Listings (Indigo / Electric Blue)
    id: 1,
    tag: "Payload Ingestion",
    icon: FileInput,
    nodeLabel: "NODE 01 // DATA ENTRY",
    colorHex: "#6366f1",
    activeText: "text-indigo-400",
    activeBg: "bg-gradient-to-r from-indigo-500/20 via-[#0e1328] to-[#080d19]",
    activeIconBg: "border-indigo-500/50 bg-indigo-500/20 text-indigo-400",
    hoverIconBg: "group-hover:border-indigo-500/40 group-hover:text-indigo-400",
    activeIndicator: "bg-indigo-500 shadow-[0_0_14px_#6366f1]",
    tagColor: "text-indigo-400",
    dotColor: "bg-indigo-500",
    badgeBorder: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    mobileActive: "border-indigo-500 bg-indigo-500/20 text-white shadow-md shadow-indigo-500/20",
  },
  {
    // Node 02: AI Deep Scan (Cyan / Neon Teal)
    id: 2,
    tag: "Neural Pattern Extraction",
    icon: Cpu,
    nodeLabel: "NODE 02 // AI DEEP SCAN",
    colorHex: "#1ecfc1",
    activeText: "text-[#1ecfc1]",
    activeBg: "bg-gradient-to-r from-[#1ecfc1]/20 via-[#0c1a24] to-[#080d19]",
    activeIconBg: "border-[#1ecfc1]/50 bg-[#1ecfc1]/20 text-[#1ecfc1]",
    hoverIconBg: "group-hover:border-[#1ecfc1]/40 group-hover:text-[#1ecfc1]",
    activeIndicator: "bg-[#1ecfc1] shadow-[0_0_14px_#1ecfc1]",
    tagColor: "text-[#1ecfc1]",
    dotColor: "bg-[#1ecfc1]",
    badgeBorder: "border-[#1ecfc1]/30 text-[#1ecfc1] bg-[#1ecfc1]/10",
    mobileActive: "border-[#1ecfc1] bg-[#1ecfc1]/20 text-white shadow-md shadow-[#1ecfc1]/20",
  },
  {
    // Node 03: Safety Verdict (Emerald / Neon Green)
    id: 3,
    tag: "Confidence Rating",
    icon: ShieldCheck,
    nodeLabel: "NODE 03 // SAFETY VERDICT",
    colorHex: "#10b981",
    activeText: "text-emerald-400",
    activeBg: "bg-gradient-to-r from-emerald-500/20 via-[#0a1b18] to-[#080d19]",
    activeIconBg: "border-emerald-500/50 bg-emerald-500/20 text-emerald-400",
    hoverIconBg: "group-hover:border-emerald-500/40 group-hover:text-emerald-400",
    activeIndicator: "bg-emerald-500 shadow-[0_0_14px_#10b981]",
    tagColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
    badgeBorder: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    mobileActive: "border-emerald-500 bg-emerald-500/20 text-white shadow-md shadow-emerald-500/20",
  },
];

function WorkSectionLeft() {
  // Default to step 1 (hover: 1) or null for all-view, allows intuitive exploration
  const [hoverObject, setHoverObject] = useState(null);
  const [pinnedObject, setPinnedObject] = useState(null);

  // Active object is pinned selection if set, otherwise current hover (or null for all)
  const activeHover = pinnedObject !== null ? pinnedObject : hoverObject;

  const currentTheme =
    activeHover !== null ? STEP_THEMES.find((t) => t.id === activeHover) : null;

  const handleCardClick = (hoverVal) => {
    if (pinnedObject === hoverVal) {
      setPinnedObject(null); // toggle off pinning
    } else {
      setPinnedObject(hoverVal);
    }
  };

  const getActiveNodeLabel = () => {
    if (currentTheme) return currentTheme.nodeLabel;
    return "SYSTEM OVERVIEW // 3 ACTIVE NODES";
  };

  return (
    <div className="mt-12 w-full">
      {/* Interactive Guidance Bar / Affordance Notice */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0d1527]/80 via-[#0d1a2d]/60 to-[#0d1527]/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${currentTheme ? currentTheme.dotColor : "bg-[#1ecfc1]"
                }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${currentTheme ? currentTheme.dotColor : "bg-[#1ecfc1]"
                }`}
            />
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-200">
            <span className="font-semibold text-white">Interactive Pipeline:</span> Hover or tap steps to isolate 3D components
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeHover !== null && (
            <button
              onClick={() => {
                setPinnedObject(null);
                setHoverObject(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#1ecfc1]" />
              View Full Architecture
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP BENTO GRID LAYOUT */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Seamless Interactive Function Cards Stack (5 cols) */}
        <motion.div
          className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d19]/90 backdrop-blur-md overflow-hidden divide-y divide-white/10 shadow-2xl"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {works.map((work, idx) => {
            const theme = STEP_THEMES[idx];
            const Icon = theme?.icon || Sparkles;
            const isActive = activeHover === work.hover;
            const isDimmed = activeHover !== null && !isActive;

            return (
              <div
                key={work.title}
                role="button"
                tabIndex={0}
                onMouseEnter={() => {
                  if (pinnedObject === null) setHoverObject(work.hover);
                }}
                onClick={() => handleCardClick(work.hover)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(work.hover);
                  }
                }}
                className={`group relative flex-1 flex flex-col justify-between p-5 lg:p-6 transition-all duration-200 cursor-pointer select-none text-left ${isActive
                    ? theme.activeBg
                    : isDimmed
                      ? "bg-transparent opacity-60 hover:opacity-95 hover:bg-white/[0.03]"
                      : "bg-transparent hover:bg-white/[0.04]"
                  }`}
              >
                {/* Active Indicator Bar on left with Unique Step Color */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isActive
                      ? theme.activeIndicator
                      : `bg-transparent ${theme.hoverIconBg}`
                    }`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 ${isActive
                          ? theme.activeIconBg
                          : `border-white/10 bg-white/5 text-gray-400 ${theme.hoverIconBg}`
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-semibold tracking-wider ${theme.tagColor}`}>
                          0{idx + 1}
                        </span>
                        <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                          {theme.tag}
                        </span>
                      </div>
                      <h3
                        className={`text-base font-semibold tracking-tight transition-colors duration-200 ${isActive ? "text-white" : "text-gray-200 group-hover:text-white"
                          }`}
                      >
                        {work.title}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${isActive
                        ? `${theme.activeIconBg} translate-x-0.5`
                        : `border-white/5 bg-white/5 text-gray-400 opacity-40 group-hover:opacity-100 ${theme.tagColor}`
                      }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
                  {work.description}
                </p>

                {/* Sub-pill on active */}
                {isActive && (
                  <div className={`mt-2.5 flex items-center gap-2 pt-2 border-t border-white/10 text-[11px] font-mono ${theme.activeText}`}>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${theme.dotColor} animate-pulse`} />
                    ISOLATING 3D COMPONENT TELEMETRY
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Right Column: Cyber-HUD 3D Viewport Frame (7 cols) */}
        <motion.div
          className="lg:col-span-7 flex flex-col"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative flex-1 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#090e1c] to-[#060913] shadow-2xl">
            {/* Viewfinder Crosshairs / Decorative HUD Brackets */}
            <div className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-white/20" />
            <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-white/20" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-white/20" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-white/20" />

            {/* HUD Viewport Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${activeHover === 1 ? "bg-indigo-500 ring-2 ring-indigo-400/40" : "bg-indigo-500/40"}`} />
                  <div className={`h-2.5 w-2.5 rounded-full ${activeHover === 2 ? "bg-[#1ecfc1] ring-2 ring-[#1ecfc1]/40" : "bg-[#1ecfc1]/40"}`} />
                  <div className={`h-2.5 w-2.5 rounded-full ${activeHover === 3 ? "bg-emerald-500 ring-2 ring-emerald-400/40" : "bg-emerald-500/40"}`} />
                </div>
                <div className="ml-2 font-mono text-xs font-semibold tracking-wider text-gray-300">
                  {getActiveNodeLabel()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium border ${currentTheme
                      ? currentTheme.badgeBorder
                      : "bg-[#1ecfc1]/10 text-[#1ecfc1] border-[#1ecfc1]/20"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full animate-ping ${currentTheme ? currentTheme.dotColor : "bg-[#1ecfc1]"
                      }`}
                  />
                  LIVE WebGL
                </span>
              </div>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="relative flex-1 w-full min-h-[460px] flex items-center justify-center">
              <ScaleArchitectureDiagram hoverObject={activeHover} />

              {/* Ambient radial lighting in viewport matched to current active theme */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20 transition-all duration-500"
                style={{
                  background: currentTheme
                    ? `radial-gradient(circle at center, ${currentTheme.colorHex}22 0%, transparent 70%)`
                    : "radial-gradient(circle at center, rgba(30,207,193,0.08) 0%, transparent 70%)",
                }}
              />
            </div>

          </div>
        </motion.div>
      </div>

      {/* MOBILE INTERACTIVE VIEW */}
      <div className="flex flex-col gap-6 lg:hidden">
        {/* Mobile Tab Selector */}
        <div className="grid grid-cols-3 gap-2">
          {works.map((work, idx) => {
            const theme = STEP_THEMES[idx];
            const isActive = activeHover === work.hover;
            return (
              <button
                key={work.title}
                onClick={() => setHoverObject(work.hover)}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${isActive
                    ? theme.mobileActive
                    : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
              >
                <span className={`font-mono text-xs font-bold ${theme.tagColor}`}>
                  0{idx + 1}
                </span>
                <span className="text-[11px] font-medium leading-tight mt-0.5 line-clamp-1">
                  {work.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile 3D Preview Frame */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d] p-1">
          <div className="h-[340px] w-full">
            <ScaleArchitectureDiagram hoverObject={activeHover} />
          </div>
          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            {works.find((w) => w.hover === activeHover) && (
              <div>
                <h4 className="font-semibold text-white text-base">
                  {works.find((w) => w.hover === activeHover)?.title}
                </h4>
                <p className="mt-1 text-sm text-gray-400">
                  {works.find((w) => w.hover === activeHover)?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TELEMETRY TRUST & SECURITY METRIC CARDS (Bento bottom tier) */}
      <motion.div
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-[#0a0e1c]/60 p-4 backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1ecfc1]/30 bg-[#1ecfc1]/10 text-[#1ecfc1]">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">AI Review</div>
            <div className="text-sm font-semibold text-white mt-0.5">Text & Screenshot Analysis</div>
            <p className="text-xs text-gray-400 mt-1">Submitted content is reviewed for common job-scam patterns.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-[#0a0e1c]/60 p-4 backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1ecfc1]/30 bg-[#1ecfc1]/10 text-[#1ecfc1]">
            <SearchCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Risk Indicators</div>
            <div className="text-sm font-semibold text-white mt-0.5">Language & Payment Signals</div>
            <p className="text-xs text-gray-400 mt-1">The model reviews submitted content; it does not verify employer records.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-[#0a0e1c]/60 p-4 backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1ecfc1]/30 bg-[#1ecfc1]/10 text-[#1ecfc1]">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Submission Transparency</div>
            <div className="text-sm font-semibold text-white mt-0.5">Reports Are Stored</div>
            <p className="text-xs text-gray-400 mt-1">Submitted text is saved with reports and may be publicly accessible.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default WorkSectionLeft;
