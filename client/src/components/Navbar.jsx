import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchCheck, Users, ShieldCheck, LogOut, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070a13]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-mono text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1ecfc1]/40 bg-gradient-to-br from-[#1ecfc1]/20 via-[#0f172a] to-[#070a13] text-[#1ecfc1] shadow-[0_0_15px_-3px_rgba(30,207,193,0.3)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span>
              Loker<span className="text-[#1ecfc1]">Buster</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link
              to="/"
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/test"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                isActive("/test")
                  ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30 shadow-[0_0_12px_-2px_rgba(30,207,193,0.25)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <SearchCheck className="h-4 w-4 text-[#1ecfc1]" />
              Threat Scanner
            </Link>
            <Link
              to="/community"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                isActive("/community")
                  ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30 shadow-[0_0_12px_-2px_rgba(30,207,193,0.25)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <Users className="h-4 w-4" />
              Community Ledger
            </Link>
          </div>

          {/* User Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-gray-200">{user.username || user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-[#1ecfc1] text-gray-950 hover:bg-[#1ecfc1]/90 font-medium text-xs px-3.5 shadow-[0_0_15px_-3px_rgba(30,207,193,0.4)] cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
