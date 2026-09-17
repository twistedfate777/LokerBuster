import { ShieldAlert, ShieldCheck } from "lucide-react";

function Card({ report }) {
  const {
    company_name,
    position,
    scam_score,
    confidence_level,
    is_scam,
    reason,
    red_flags,
    green_flags,
    source_type,
    created_at,
    user_email,
  } = report;

  const scoreColor = is_scam ? "text-red-400" : "text-emerald-400";
  const badgeBg = is_scam ? "bg-red-500/20" : "bg-emerald-500/20";
  const badgeText = is_scam ? "SCAM" : "SAFE";
  const Icon = is_scam ? ShieldAlert : ShieldCheck;

  const flagCount = (red_flags?.length || 0) + (green_flags?.length || 0);

  return (
    <div className="flex flex-auto flex-col gap-4 px-4 py-4 hover:scale-[1.02] transition-all cursor-pointer border rounded-lg">
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3 items-center min-w-0">
          <div className={`p-2 rounded-full shrink-0 ${badgeBg}`}>
            <Icon className={`w-5 h-5 ${scoreColor}`} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-base sm:text-lg truncate">
              {company_name || "Unknown Company"}
            </p>
            {position && (
              <p className="text-xs text-muted-foreground truncate">{position}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${badgeBg} ${scoreColor}`}
        >
          {badgeText}
        </span>
      </div>

      <div className="flex gap-4 sm:gap-6 text-sm flex-wrap">
        <div>
          <p className="text-muted-foreground">Scam Score</p>
          <p className={`text-xl sm:text-2xl font-black ${scoreColor}`}>
            {scam_score}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Confidence</p>
          <p className="text-xl sm:text-2xl font-black text-[#1ecfc1]">
            {confidence_level}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Source</p>
          <p className="text-sm font-medium capitalize">{source_type}</p>
        </div>
        {flagCount > 0 && (
          <div>
            <p className="text-muted-foreground">Flags</p>
            <div className="flex gap-2 mt-1">
              {red_flags?.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                  {red_flags.length} red
                </span>
              )}
              {green_flags?.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {green_flags.length} green
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {reason && (
        <p className="text-sm text-muted-foreground line-clamp-2">{reason}</p>
      )}

      {user_email && (
        <p className="text-xs text-muted-foreground/60">by {user_email}</p>
      )}
    </div>
  );
}

export default Card;
