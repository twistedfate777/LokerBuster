import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Activity, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const HEALTH_POLL_INTERVAL_MS = 30_000;

const HEALTH_STATUS_CONFIG = {
  healthy: {
    label: "Operational",
    container: "border-emerald-500/25 bg-emerald-500/10",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  degraded: {
    label: "Degraded",
    container: "border-amber-500/30 bg-amber-500/10",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  unhealthy: {
    label: "Unavailable",
    container: "border-red-500/30 bg-red-500/10",
    dot: "bg-red-400",
    text: "text-red-400",
  },
  unknown: {
    label: "Checking...",
    container: "border-white/15 bg-white/5",
    dot: "bg-gray-400",
    text: "text-gray-300",
  },
};

function Footer() {
  const [health, setHealth] = useState({ status: "unknown", services: {} });

  useEffect(() => {
    let isMounted = true;

    const fetchHealth = async () => {
      try {
        const response = await api.get("health/", { timeout: 10000 });
        if (isMounted) setHealth(response.data);
      } catch (error) {
        if (!isMounted) return;
        setHealth(error.response?.data?.status
          ? error.response.data
          : { status: "unhealthy", services: {} });
      }
    };

    fetchHealth();
    const intervalId = window.setInterval(fetchHealth, HEALTH_POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const healthStatus = HEALTH_STATUS_CONFIG[health.status] || HEALTH_STATUS_CONFIG.unknown;
  const serviceSummary = Object.entries(health.services || {})
    .map(([name, service]) => `${name}: ${service.status}`)
    .join(" | ");

  return (
    <footer className="border-t border-white/10 bg-[#060913] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold font-mono tracking-wider text-white w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1ecfc1]/40 bg-[#1ecfc1]/10 text-[#1ecfc1] shadow-[0_0_15px_-3px_rgba(30,207,193,0.3)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span>Loker<span className="text-[#1ecfc1]">Buster</span></span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-gray-400">
              AI-powered job scam detection engine. Protecting job seekers and career builders from ghost companies, advance fee scams, and recruitment traps.
            </p>
            <div
              aria-live="polite"
              title={serviceSummary || "Checking backend services"}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 w-fit ${healthStatus.container}`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${healthStatus.dot} opacity-75`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${healthStatus.dot}`} />
              </span>
              <span className="font-mono text-xs text-gray-300">
                Backend Status: <strong className={`${healthStatus.text} font-semibold`}>{healthStatus.label}</strong>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3.5 border-t border-white/5 pt-6 md:border-0 md:pt-0">
            <h4 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-gray-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1ecfc1]" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/test" className="text-gray-400 hover:text-[#1ecfc1] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Job Threat Scanner</span>
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-[#1ecfc1] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Community Threat Ledger</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-[#1ecfc1] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-0.5 transition-transform">Sign In / Register</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="md:col-span-3 lg:col-span-4 flex flex-col border-t border-white/5 pt-6 md:border-0 md:pt-0">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-sm flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1ecfc1]/10 text-[#1ecfc1] border border-[#1ecfc1]/20">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <span>Zero-Retention Ingestion</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                Resumes & links are processed in volatile memory and never stored without explicit user submission.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Client-Safe AI Pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 sm:pt-8 text-xs text-gray-400 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} LokerBuster. Built for job seeker defense.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1ecfc1]" />
              RusdiDeveloperHub
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              v2.4.0 Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
