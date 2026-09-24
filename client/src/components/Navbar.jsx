import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchCheck, Users, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 pointer-events-none">
      <div
        className={`w-full transition-all duration-300 ease-out flex justify-center pointer-events-auto ${
          isScrolled ? "pt-3 px-4 sm:px-6" : "pt-0 px-0"
        }`}
      >
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "max-w-5xl rounded-full border border-white/15 bg-[#070a13]/85 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.65),0_0_20px_rgba(30,207,193,0.12)] px-4 sm:px-6 py-2"
              : "border-b border-white/10 bg-[#070a13]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-0"
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "h-11 sm:h-12 max-w-full" : "h-16 max-w-7xl"
            }`}
          >
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-mono text-base sm:text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <div
                className={`flex items-center justify-center rounded-xl border border-[#1ecfc1]/40 bg-gradient-to-br from-[#1ecfc1]/20 via-[#0f172a] to-[#070a13] text-[#1ecfc1] shadow-[0_0_15px_-3px_rgba(30,207,193,0.3)] transition-all duration-300 ${
                  isScrolled ? "h-7 w-7 sm:h-8 sm:w-8" : "h-9 w-9"
                }`}
              >
                <ShieldCheck className={isScrolled ? "h-4 w-4" : "h-5 w-5"} />
              </div>
              <span>
                Loker<span className="text-[#1ecfc1]">Buster</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 sm:gap-1.5">
              <Link
                to="/"
                className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                Overview
              </Link>
              <Link
                to="/test"
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive("/test")
                    ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30 shadow-[0_0_12px_-2px_rgba(30,207,193,0.25)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <SearchCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1ecfc1]" />
                Threat Scanner
              </Link>
              <Link
                to="/community"
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive("/community")
                    ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30 shadow-[0_0_12px_-2px_rgba(30,207,193,0.25)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Community Ledger
              </Link>
            </div>

            {/* User Auth CTA */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-xs font-medium text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-gray-200 truncate max-w-[120px]">
                      {user.username || user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-full h-8 cursor-pointer"
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
                      className="text-xs text-gray-300 hover:bg-white/5 hover:text-white rounded-full h-8 px-3 cursor-pointer"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="sm"
                      className="bg-[#1ecfc1] text-gray-950 hover:bg-[#1ecfc1]/90 font-medium text-xs px-3.5 rounded-full h-8 shadow-[0_0_15px_-3px_rgba(30,207,193,0.4)] cursor-pointer"
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
        </motion.nav>
      </div>
    </header>
  );
}

export default Navbar;
