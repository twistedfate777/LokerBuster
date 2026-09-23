import { useState, useEffect } from "react";
import Card from "@/components/Card";
import JobSkeleton from "@/components/skeletons/JobSkeleton";
import api from "@/lib/api";
import { Users, Search, ShieldAlert, ShieldCheck, Sparkles, Filter } from "lucide-react";

function Community() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "scam" | "safe"

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/", { params: { all: "true" } });
        setReports(res.data.results || []);
      } catch {
        setError("Gagal memuat data laporan komunitas.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.company_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.position || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.reason || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "scam") {
      return report.is_scam || report.scam_score >= 60;
    }
    if (activeFilter === "safe") {
      return !report.is_scam && report.scam_score < 60;
    }
    return true;
  });

  return (
    <section className="py-10 sm:py-16 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1ecfc1]/10 border border-[#1ecfc1]/30 text-xs font-semibold text-[#1ecfc1] mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>LokerBuster Community Ledger</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Riwayat Scan <span className="text-[#1ecfc1]">Komunitas</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl">
          Kumpulan hasil analisis lowongan kerja dari seluruh pengguna. Saling bantu dan lindungi sesama pencari kerja dari jeratan penipuan.
        </p>

        {/* Search & Filter Bar (Heuristic #7: Flexibility and efficiency of use) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-4xl">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama perusahaan atau posisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#1ecfc1]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeFilter === "all"
                  ? "bg-[#1ecfc1] text-gray-950 shadow-[0_0_15px_rgba(30,207,193,0.3)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              Semua ({reports.length})
            </button>
            <button
              onClick={() => setActiveFilter("scam")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeFilter === "scam"
                  ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  : "bg-slate-900/80 text-red-400 hover:text-red-300 border border-white/5"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Terindikasi Scam</span>
            </button>
            <button
              onClick={() => setActiveFilter("safe")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeFilter === "safe"
                  ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900/80 text-emerald-400 hover:text-emerald-300 border border-white/5"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aman Terverifikasi</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
          {error}
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="cyber-glass rounded-2xl p-5 border border-white/10">
              <JobSkeleton />
            </div>
          ))
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => <Card report={report} key={report.id} />)
        ) : (
          <div className="col-span-full text-center py-16 cyber-glass rounded-2xl border border-white/10 p-8">
            <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Tidak ada data laporan yang ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Coba gunakan kata kunci pencarian lain atau jadilah yang pertama melakukan scan lowongan baru.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Community;
