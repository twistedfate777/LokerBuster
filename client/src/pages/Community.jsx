import { useState, useEffect, useMemo } from "react";
import Card from "@/components/Card";
import JobSkeleton from "@/components/skeletons/JobSkeleton";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  Filter,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Community() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "scams" | "safe"

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/", { params: { all: "true" } });
        setReports(res.data.results || []);
      } catch {
        setError("Unable to load community threat records.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Compute telemetry metrics
  const stats = useMemo(() => {
    const total = reports.length;
    const scams = reports.filter((r) => r.is_scam).length;
    const safe = total - scams;
    const scamRate = total > 0 ? ((scams / total) * 100).toFixed(1) : "0.0";
    return { total, scams, safe, scamRate };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchSearch =
        (item.company_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.position || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reason || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (filterType === "scams") return item.is_scam;
      if (filterType === "safe") return !item.is_scam;
      return true;
    });
  }, [reports, searchQuery, filterType]);

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-6xl overflow-hidden opacity-25">
        <div className="absolute top-0 left-1/3 h-[350px] w-[500px] rounded-full bg-[#1ecfc1]/20 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1ecfc1]/30 bg-[#1ecfc1]/10 px-3.5 py-1 text-xs font-medium text-[#1ecfc1] mb-3">
              <Users className="h-3.5 w-3.5" />
              Decentralized Defense Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Community Threat Ledger
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl">
              Live threat reports submitted and scanned by job seekers worldwide. Explore known fraudulent patterns before engaging recruiters.
            </p>
          </div>

          <Link to="/test">
            <Button className="flex items-center gap-2 rounded-xl bg-[#1ecfc1] text-gray-950 font-semibold px-5 py-2.5 hover:bg-[#1ecfc1]/90 shadow-[0_0_20px_-3px_rgba(30,207,193,0.4)] cursor-pointer">
              <PlusCircle className="h-4 w-4" />
              Scan New Job Offer
            </Button>
          </Link>
        </div>

        {/* Live Telemetry Metric Cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#090e1c]/70 p-4 sm:p-5 backdrop-blur-md">
            <span className="font-mono text-xs text-gray-400 uppercase">Total Scanned</span>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white">
              {loading ? "..." : stats.total}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">Verified dossiers</span>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-red-400 uppercase">Scams Detected</span>
              <ShieldAlert className="h-4 w-4 text-red-400" />
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-red-400">
              {loading ? "..." : stats.scams}
            </div>
            <span className="text-[11px] text-red-300/70 mt-1 block">Confirmed fraudulent</span>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400 uppercase">Verified Safe</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-emerald-400">
              {loading ? "..." : stats.safe}
            </div>
            <span className="text-[11px] text-emerald-300/70 mt-1 block">Legitimate listings</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#090e1c]/70 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-400 uppercase">Threat Ratio</span>
              <Activity className="h-4 w-4 text-[#1ecfc1]" />
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-[#1ecfc1]">
              {loading ? "..." : `${stats.scamRate}%`}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">Flagged rate in feed</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search company, job role, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#060a14] pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filterType === "all"
                  ? "bg-[#1ecfc1] text-gray-950 font-semibold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterType("scams")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filterType === "scams"
                  ? "bg-red-500 text-white font-semibold shadow-sm"
                  : "text-gray-400 hover:text-red-300"
              }`}
            >
              <ShieldAlert className="h-3 w-3" />
              Scams Only
            </button>
            <button
              onClick={() => setFilterType("safe")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filterType === "safe"
                  ? "bg-emerald-500 text-white font-semibold shadow-sm"
                  : "text-gray-400 hover:text-emerald-300"
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              Verified Safe
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Dossier Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-[#0a0f1d]/50 p-6">
                <JobSkeleton />
              </div>
            ))
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card report={report} key={report.id} />
            ))
          ) : (
            <div className="col-span-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center">
              <Layers className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <p className="text-base font-semibold text-gray-300">No matching threat reports found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Try adjusting your search query or submit a new job offer to perform a live scan.
              </p>
              <Link to="/test" className="inline-block mt-4">
                <Button variant="outline" size="sm" className="border-white/10 text-xs">
                  Scan a Job Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Community;
