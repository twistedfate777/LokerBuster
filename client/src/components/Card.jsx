import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";

function Card({ report }) {
  const {
    company_name,
    position,
    scam_score = 0,
    confidence_level = 0,
    is_scam,
    reason,
    red_flags = [],
    green_flags = [],
    source_type,
    created_at,
  } = report;

  const scoreColor = is_scam ? "text-red-400" : "text-emerald-400";
  const badgeBg = is_scam
    ? "border border-red-500/30 bg-red-500/10 text-red-400"
    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  const badgeText = is_scam ? "HIGH RISK" : "LOWER RISK";
  const Icon = is_scam ? ShieldAlert : ShieldCheck;

  // Generate initial monogram
  const initials = (company_name || "UC")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0f1d]/80 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-[#1ecfc1]/40 hover:bg-[#0d1527] hover:shadow-[0_0_30px_-5px_rgba(30,207,193,0.15)] hover:-translate-y-0.5 select-none">
      {/* Top Header: Company Avatar & Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold border transition-colors ${
                is_scam
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {initials}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg text-white truncate group-hover:text-[#1ecfc1] transition-colors">
                {company_name || "Unverified Company"}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {position || "General Job Posting"}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider shrink-0 ${badgeBg}`}>
            <Icon className="h-3.5 w-3.5" />
            {badgeText}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
          <div>
            <span className="font-mono text-[10px] text-gray-400 uppercase block">
              Risk Score
            </span>
            <span className={`font-mono text-base font-bold ${scoreColor}`}>
              {scam_score}%
            </span>
          </div>
          <div className="border-x border-white/5">
            <span className="font-mono text-[10px] text-gray-400 uppercase block">
              Confidence
            </span>
            <span className="font-mono text-base font-bold text-[#1ecfc1]">
              {confidence_level}%
            </span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-gray-400 uppercase block">
              Source
            </span>
            <span className="font-mono text-xs font-semibold text-gray-300 capitalize truncate block">
              {source_type || "Direct"}
            </span>
          </div>
        </div>

        {/* Reason snippet */}
        {reason && (
          <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
            {reason}
          </p>
        )}

        {/* Flag Badges */}
        {(red_flags?.length > 0 || green_flags?.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {red_flags?.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 font-mono text-[10px] text-red-300">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                {red_flags.length} Red {red_flags.length === 1 ? "Flag" : "Flags"}
              </span>
            )}
            {green_flags?.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                {green_flags.length} Positive Signals
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] font-mono text-gray-400">
        <span className="flex items-center gap-1 text-gray-400">
          <Calendar className="h-3 w-3 text-gray-400" />
          {created_at
            ? new Date(created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent"}
        </span>

      </div>
    </div>
  );
}

export default Card;
