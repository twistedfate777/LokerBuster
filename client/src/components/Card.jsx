import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";

function Card({ report }) {
  const [expanded, setExpanded] = useState(false);

  const {
    company_name = "Perusahaan Tidak Dikenal",
    position = "Posisi Umum",
    scam_score = 0,
    confidence_level = 0,
    is_scam = false,
    reason = "",
    red_flags = [],
    green_flags = [],
    source_type = "text",
    created_at = new Date().toISOString(),
    user_email = "",
  } = report;

  const isScamVerdict = is_scam || scam_score >= 60;
  const scoreColor = isScamVerdict ? "text-red-400" : "text-emerald-400";
  const badgeBg = isScamVerdict
    ? "bg-red-500/20 text-red-400 border-red-500/30"
    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  const badgeText = isScamVerdict ? "SCAM DETECTED" : "VERIFIED SAFE";
  const Icon = isScamVerdict ? ShieldAlert : ShieldCheck;

  return (
    <div
      onClick={() => setExpanded((prev) => !prev)}
      className="cyber-glass rounded-2xl p-5 border border-white/10 hover:border-[#1ecfc1]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 group hover:shadow-[0_0_20px_rgba(30,207,193,0.1)]"
    >
      {/* Top Row: Icon + Company/Position + Verdict Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`p-2.5 rounded-xl shrink-0 border ${
              isScamVerdict ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"
            }`}
          >
            <Icon className={`w-5 h-5 ${scoreColor}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-white truncate group-hover:text-[#1ecfc1] transition-colors">
              {company_name || "Perusahaan Anonim"}
            </h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {position || "Lowongan Terpublikasi"}
            </p>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${badgeBg}`}>
          {badgeText}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
        <div>
          <p className="text-[10px] text-slate-400">Scam Score</p>
          <p className={`text-base sm:text-lg font-black ${scoreColor}`}>{scam_score}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Confidence</p>
          <p className="text-base sm:text-lg font-black text-[#1ecfc1]">{confidence_level}%</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Sumber</p>
          <p className="text-xs font-semibold text-slate-200 capitalize mt-1 truncate">
            {source_type === "image" ? "Foto / OCR" : "Teks"}
          </p>
        </div>
      </div>

      {/* Summary Snippet */}
      {reason && (
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {reason}
        </p>
      )}

      {/* Expandable Details */}
      {expanded && (
        <div className="pt-3 border-t border-white/10 space-y-3 text-xs">
          {red_flags.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Red Flags:
              </span>
              <ul className="space-y-1 text-red-300/80 pl-4 list-disc">
                {red_flags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {green_flags.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Green Flags:
              </span>
              <ul className="space-y-1 text-emerald-300/80 pl-4 list-disc">
                {green_flags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {user_email && (
            <span className="flex items-center gap-1 text-slate-500">
              <User className="w-3 h-3" />
              {user_email}
            </span>
          )}
        </div>
        <button
          type="button"
          className="text-[#1ecfc1] hover:underline flex items-center gap-1"
        >
          {expanded ? "Ringkas" : "Rincian"}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}

export default Card;
