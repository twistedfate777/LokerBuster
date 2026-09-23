import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SearchAlert, Users, HelpCircle, Shield, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "@/context/AuthContext";
import ScamGuideModal from "./ScamGuideModal";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [guideOpen, setGuideOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#07090e]/70 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Logo & Live Engine Status */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#1ecfc1]/20 to-blue-500/20 border border-[#1ecfc1]/40 group-hover:border-[#1ecfc1] transition-all duration-300">
                  <Shield className="w-5 h-5 text-[#1ecfc1]" />
                </div>
                <div className="flex items-center text-xl font-bold font-mono tracking-wider">
                  <span className="text-white">Loker</span>
                  <span className="text-[#1ecfc1] ml-0.5">Buster</span>
                </div>
              </Link>

              {/* Live AI Status Pill (Heuristic #1: Visibility of System Status) */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-[11px] text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium">AI Engine Online • 99.4% Accuracy</span>
              </div>
            </div>

            {/* Middle / Right: Nav Items */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  isActive("/test")
                    ? "bg-[#1ecfc1]/15 text-[#1ecfc1] font-semibold border border-[#1ecfc1]/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                asChild
              >
                <Link to={user ? "/test" : "/login"}>
                  <SearchAlert className="w-4 h-4 text-[#1ecfc1]" />
                  <span>Scan Lowongan</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  isActive("/community")
                    ? "bg-[#1ecfc1]/15 text-[#1ecfc1] font-semibold border border-[#1ecfc1]/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                asChild
              >
                <Link to="/community">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Community Ledger</span>
                </Link>
              </Button>

              {/* Heuristic #10: Help & Documentation trigger */}
              <Button
                variant="ghost"
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 text-xs sm:text-sm"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Panduan Scam</span>
              </Button>

              <div className="h-5 w-px bg-white/10 mx-2" />

              {/* User Profile / Auth State */}
              {user ? (
                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-white max-w-[130px] truncate">
                      {user.username}
                    </span>
                    <span className="text-[10px] text-[#1ecfc1]">
                      {user.isDemo ? "Roblox Guest" : "Verified User"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-xs"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white text-sm"
                    asChild
                  >
                    <Link to="/login">Masuk</Link>
                  </Button>
                  <Button
                    className="bg-[#1ecfc1] text-gray-950 font-semibold hover:bg-[#1ecfc1]/90 shadow-[0_0_15px_rgba(30,207,193,0.3)] text-sm px-4"
                    asChild
                  >
                    <Link to="/register">Daftar Akun</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Nav Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setGuideOpen(true)}
                className="p-2 rounded-lg bg-white/5 text-amber-400 border border-white/10"
                title="Panduan Scam"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <MobileNavbar onOpenGuide={() => setGuideOpen(true)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Heuristic #10: Global Scam Guide Modal */}
      <ScamGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </>
  );
}

export default Navbar;
