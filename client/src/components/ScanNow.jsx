import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ScanNow() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-[#1ecfc1]/30 bg-gradient-to-b from-[#0d1629] via-[#090f1e] to-[#060a14] p-8 sm:p-14 text-center shadow-[0_0_50px_-15px_rgba(30,207,193,0.2)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Ambient inner glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[500px] bg-[#1ecfc1]/10 blur-[90px]" />

          {/* Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#1ecfc1]/30 bg-[#1ecfc1]/10 px-3.5 py-1 text-xs font-medium text-[#1ecfc1] mb-6">
            <Zap className="h-3.5 w-3.5" />
            AI-Assisted Risk Review
          </div>

          <h2 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Ready to verify your next career opportunity?
          </h2>

          <p className="mt-4 text-pretty text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            Submit job text or a screenshot to receive an AI-generated risk estimate and explanation. It is a signal for further checks, not employer verification.
          </p>

          {/* Feature guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1ecfc1]" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1ecfc1]" />
              <span>AI-assisted risk signals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1ecfc1]" />
              <span>No Credit Card Required</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 flex justify-center">
            <Link to="/test">
              <Button className="flex items-center gap-2 rounded-xl bg-[#1ecfc1] text-gray-950 px-8 py-6 text-base font-semibold shadow-[0_0_25px_-5px_rgba(30,207,193,0.5)] hover:bg-[#1ecfc1]/90 hover:scale-[1.02] transition-all cursor-pointer">
                Launch Threat Scanner
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ScanNow;
