import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Copy,
  RotateCcw,
  Check,
  Sparkles,
  Building2,
  Briefcase,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { Button } from "@/components/ui/button";

export default function Result() {
  const location = useLocation();
  const report = location.state?.report;

  const [copied, setCopied] = useState(false);

  if (!report) return <Navigate to="/test" replace />;

  const {
    scam_score = 0,
    confidence_level = 0,
    reason = "",
    company_name = "",
    position = "",
    is_scam = false,
    red_flags = [],
    green_flags = [],
  } = report;

  const scoreData = [{ value: scam_score }];
  const confidenceData = [{ value: confidence_level }];

  // Color mappings
  const isHighRisk = scam_score >= 60 || is_scam;
  const isModerateRisk = scam_score >= 35 && scam_score < 60;

  const verdictTheme = isHighRisk
    ? {
        title: "TERINDIKASI SCAM / BERBAHAYA",
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
        gaugeColor: "#ef4444",
        summaryText:
          "Sangat disarankan untuk TIDAK melanjutkan proses rekrutmen ini. Risiko kerugian finansial atau pencurian identitas sangat tinggi.",
      }
    : isModerateRisk
    ? {
        title: "PERHATIAN: RISIKO MENENGAH",
        badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        gaugeColor: "#f59e0b",
        summaryText:
          "Ditemukan beberapa kejanggalan pada rincian lowongan. Lakukan pengecekan identitas perusahaan secara independen sebelum memberikan data pribadi.",
      }
    : {
        title: "LOWONGAN TERLIHAT AMAN",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
        gaugeColor: "#10b981",
        summaryText:
          "Tidak ditemukan indikator bahaya yang signifikan. Namun tetap waspada dan jangan pernah mentransfer uang dalam proses seleksi.",
      };

  const handleCopySummary = () => {
    const summary = `[LokerBuster Security Report]
Perusahaan: ${company_name || "N/A"}
Posisi: ${position || "N/A"}
Status: ${is_scam ? "TERINDIKASI SCAM" : "AMAN"}
Scam Score: ${scam_score}/100 | Confidence: ${confidence_level}%
Catatan: ${reason}
Diverifikasi oleh LokerBuster AI.`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-10 sm:py-16 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link
          to="/test"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Scan Lowongan Lain</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="border-white/10 hover:border-[#1ecfc1]/40 text-xs text-slate-300 hover:text-[#1ecfc1] gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Ringkasan</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Verdict Dossier Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="cyber-glass-glow rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8"
      >
        {/* Header with Title and Company Dossier */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              LokerBuster Dossier Report
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hasil Analisis Keamanan
              </h1>
            </div>
            {(company_name || position) && (
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300">
                {company_name && (
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Building2 className="w-4 h-4 text-[#1ecfc1]" />
                    {company_name}
                  </span>
                )}
                {position && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    {position}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div
            className={`px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${verdictTheme.badgeColor}`}
          >
            {isHighRisk ? (
              <ShieldAlert className="w-5 h-5 text-red-400" />
            ) : isModerateRisk ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <span>{verdictTheme.title}</span>
          </div>
        </div>

        {/* Dual Gauges (Scam Score & Confidence Level) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gauge 1: Scam Score */}
          <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Indeks Risiko (Scam Score)
            </span>

            <div className="relative w-48 h-32 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="100%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={16}
                  data={scoreData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: "rgba(255,255,255,0.05)" }}
                    dataKey="value"
                    cornerRadius={10}
                    fill={verdictTheme.gaugeColor}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-3xl font-black text-white">{scam_score}</span>
                <span className="text-[10px] text-slate-400">/ 100 POIN</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 max-w-xs">{verdictTheme.summaryText}</p>
          </div>

          {/* Gauge 2: Confidence Level */}
          <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tingkat Keyakinan AI (Confidence)
            </span>

            <div className="relative w-48 h-32 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="100%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={16}
                  data={confidenceData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: "rgba(255,255,255,0.05)" }}
                    dataKey="value"
                    cornerRadius={10}
                    fill="#1ecfc1"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-3xl font-black text-white">{confidence_level}%</span>
                <span className="text-[10px] text-[#1ecfc1]">CONFIDENCE</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 max-w-xs">
              {confidence_level >= 75
                ? "Keyakinan Tinggi: Korelasi kuat dengan basis data pola lowongan kami."
                : "Keyakinan Menengah: Data terbatas, disarankan verifikasi manual."}
            </p>
          </div>
        </div>

        {/* AI Breakdown Narrative */}
        {reason && (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1ecfc1] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Penjelasan Mendalam AI</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{reason}</p>
          </div>
        )}

        {/* Red Flags & Green Flags Breakdown Grid */}
        {(red_flags.length > 0 || green_flags.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Red Flags List */}
            {red_flags.length > 0 && (
              <div className="rounded-2xl p-5 bg-red-500/5 border border-red-500/20 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Red Flags Ditemukan ({red_flags.length})</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-red-200">
                  {red_flags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Green Flags List */}
            {green_flags.length > 0 && (
              <div className="rounded-2xl p-5 bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Green Flags Terverifikasi ({green_flags.length})</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-200">
                  {green_flags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actionable Guidance Card (Heuristic #9) */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs sm:text-sm text-blue-200">
          <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-300">Langkah Pengamanan Selanjutnya</p>
            <p>
              Jangan pernah mengirimkan uang untuk alasan apapun (tiket, akomodasi, biaya tes). Jika Anda diminta mentransfer uang, laporkan lowongan ini dan abaikan komunikasi lebih lanjut.
            </p>
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <Link to="/test" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#1ecfc1] text-gray-950 font-bold hover:bg-[#1ecfc1]/90 px-6 py-5 rounded-xl">
              <RotateCcw className="w-4 h-4 mr-2" />
              Scan Lowongan Lainnya
            </Button>
          </Link>
          <Link to="/community" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-white/15 px-6 py-5 rounded-xl">
              Lihat Database Komunitas
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
