import React from "react";
import { works } from "@/constants";
import { motion } from "framer-motion";
import WorkSectionLeft from "./WorkSectionLeft";

function Works() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-t border-white/5">
      {/* Ambient background glow & tech grid accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[400px] w-[700px] rounded-full bg-[#1ecfc1]/5 blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1ecfc1]/20 bg-[#1ecfc1]/10 px-3.5 py-1 text-xs font-medium text-[#1ecfc1] backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1ecfc1] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1ecfc1]" />
            </span>
            System Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            How LokerBuster intercepts and neutralizes job scams
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-pretty text-base text-gray-400 sm:text-lg"
          >
            Submit job text or a screenshot for an AI-assisted review of language and common scam indicators. Results are estimates, not independent employer verification.
          </motion.p>
        </div>

        {/* Interactive Architecture Bento Deck */}
        <WorkSectionLeft />
      </div>
    </section>
  );
}

export default Works;
