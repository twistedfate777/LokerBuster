import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Heart, HelpCircle } from "lucide-react";
import ScamGuideModal from "./ScamGuideModal";

export default function Footer() {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-white/10 bg-[#05070b] text-slate-400 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#1ecfc1]/20 text-[#1ecfc1]">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-mono font-bold text-lg text-white">
                  Loker<span className="text-[#1ecfc1]">Buster</span>
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Platform perlindungan pencari kerja berbasis kecerdasan buatan (AI) terdepan di Indonesia. Mendeteksi dan memblokir modus penipuan rekrutmen secara transparan.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Navigasi</p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="hover:text-[#1ecfc1] transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link to="/test" className="hover:text-[#1ecfc1] transition-colors">
                    Scan Lowongan Kerja
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-[#1ecfc1] transition-colors">
                    Community Ledger
                  </Link>
                </li>
              </ul>
            </div>

            {/* Knowledge & Help */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Pusat Edukasi</p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(true)}
                    className="hover:text-[#1ecfc1] transition-colors text-left flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    Panduan Modus Scam 101
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#1ecfc1] transition-colors">
                    FAQ & Bantuan
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px bg-white/10 my-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LokerBuster AI. Lindungi Karir Anda.</p>
            <p className="flex items-center gap-1">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> untuk Pencari Kerja Indonesia
            </p>
          </div>
        </div>
      </footer>

      <ScamGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </>
  );
}
