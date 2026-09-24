import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Share2,
  FileSearch,
  Building2,
  Briefcase,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Result() {
  const location = useLocation();
  const report = location.state?.report;
  const [copied, setCopied] = useState(false);

  if (!report) return <Navigate to="/test" replace />;

  const {
    scam_score,
    confidence_level,
    reason,
    company_name,
    position,
    is_scam,
    red_flags = [],
    green_flags = [],
  } = report;

  const handleCopyReport = () => {
    const textToCopy = `[LokerBuster Threat Report]\nTarget: ${position || "Job Offer"} at ${company_name || "Unknown Company"}\nScam Score: ${scam_score}/100 (${is_scam ? "CRITICAL RISK" : "VERIFIED SAFE"})\nConfidence: ${confidence_level}%\nReasoning: ${reason}\n\nVerify yours at: https://lokerbuster.com`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasRedFlags = red_flags && red_flags.length > 0;
  const hasGreenFlags = green_flags && green_flags.length > 0;

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      {/* Background ambient gradient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-5xl overflow-hidden opacity-25">
        <div
          className={`absolute top-0 left-1/4 h-[350px] w-[500px] rounded-full blur-[130px] ${
            is_scam ? "bg-red-500/20" : "bg-[#1ecfc1]/20"
          }`}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation back bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/test"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#1ecfc1]" />
            Back to Scanner
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-gray-400" />
                  Copy Dossier
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Threat Summary Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl ${
            is_scam
              ? "border-red-500/40 bg-gradient-to-br from-red-950/40 via-[#0f111d] to-[#070a13] shadow-[0_0_50px_-15px_rgba(239,68,68,0.2)]"
              : "border-[#1ecfc1]/40 bg-gradient-to-br from-[#1ecfc1]/10 via-[#0f172a] to-[#070a13] shadow-[0_0_50px_-15px_rgba(30,207,193,0.2)]"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                    is_scam
                      ? "border border-red-500/40 bg-red-500/20 text-red-400"
                      : "border border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {is_scam ? (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {is_scam ? "HIGH RISK: SCAM DETECTED" : "VERIFIED: LOW RISK / SAFE"}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  Dossier ID: #{Math.floor(Math.random() * 89999 + 10000)}
                </span>
              </div>

              <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {position || "Job Offer Evaluation"}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#1ecfc1]" />
                  <span>{company_name || "Unverified Employer Entity"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="text-right">
                <span className="font-mono text-xs text-gray-400 block uppercase">
                  Scam Probability
                </span>
                <span
                  className={`font-mono text-4xl sm:text-5xl font-black ${
                    is_scam ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {scam_score}
                  <span className="text-base text-gray-400 font-normal">/100</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dual Gauge Score Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Scam Score Metric Card */}
          <div className="rounded-2xl border border-white/10 bg-[#090f1e]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                Threat Risk Level
              </span>
              <span
                className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                  scam_score > 60
                    ? "bg-red-500/20 text-red-400"
                    : scam_score > 30
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {scam_score > 60 ? "SEVERE RISK" : scam_score > 30 ? "MODERATE" : "MINIMAL RISK"}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-white">{scam_score}%</span>
                <span className="text-xs text-gray-400">Scam Pattern Match</span>
              </div>
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    scam_score > 60
                      ? "bg-gradient-to-r from-amber-500 to-red-500"
                      : "bg-gradient-to-r from-teal-400 to-emerald-400"
                  }`}
                  style={{ width: `${Math.max(scam_score, 5)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Confidence Metric Card */}
          <div className="rounded-2xl border border-white/10 bg-[#090f1e]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                AI Confidence Level
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#1ecfc1]/20 text-[#1ecfc1]">
                Neural Model v2.4
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-[#1ecfc1]">
                  {confidence_level}%
                </span>
                <span className="text-xs text-gray-400">Analysis Reliability</span>
              </div>
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1ecfc1]/60 to-[#1ecfc1] transition-all duration-1000"
                  style={{ width: `${Math.max(confidence_level, 5)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flag Breakdown Matrix */}
        {(hasRedFlags || hasGreenFlags) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Red Flags List */}
            {hasRedFlags && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <h3 className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                    Red Flags Detected ({red_flags.length})
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {red_flags.map((flag, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-red-200/90 leading-relaxed"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Green Flags List */}
            {hasGreenFlags && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Legitimacy Indicators ({green_flags.length})
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {green_flags.map((flag, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-200/90 leading-relaxed"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* AI Deconstruction / Reasoning Terminal Box */}
        {reason && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 rounded-2xl border border-white/10 bg-[#080d1a] p-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <FileSearch className="h-4 w-4 text-[#1ecfc1]" />
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-300">
                AI Reasoning & Behavioral Breakdown
              </h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300 font-sans">
              {reason}
            </p>
          </motion.div>
        )}

        {/* Safe Next Steps Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h4 className="font-semibold text-white text-base">
              {is_scam ? "Recommended Defense Action" : "Next Steps for Application"}
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {is_scam
                ? "Do not pay any upfront registration fees or share sensitive identity documents."
                : "Proceed with standard application diligence through the company's verified domain."}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link to="/test" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#1ecfc1] text-gray-950 hover:bg-[#1ecfc1]/90 font-semibold text-xs px-5 py-2.5 cursor-pointer">
                Scan Another Job
              </Button>
            </Link>
            <Link to="/community" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/10 text-gray-300 hover:bg-white/10 text-xs px-4 py-2.5 cursor-pointer">
                Community Ledger
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Result;
