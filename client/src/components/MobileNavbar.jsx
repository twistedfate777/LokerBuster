import { MenuIcon, SearchCheck, Users, ShieldCheck, LogOut, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setShowMobileMenu(false);
    await logout();
    navigate("/");
  };

  if (loading) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-white/10">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] border-l border-white/10 bg-[#070a13] p-6 text-white">
          <SheetHeader className="text-left border-b border-white/10 pb-4">
            <SheetTitle className="flex items-center gap-2 font-mono text-base font-bold text-white">
              <ShieldCheck className="h-5 w-5 text-[#1ecfc1]" />
              <span>Loker<span className="text-[#1ecfc1]">Buster</span></span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-2 mt-6">
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Home className="h-4 w-4" />
              Overview
            </Link>

            <Link
              to={user ? "/test" : "/login"}
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive("/test")
                  ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <SearchCheck className="h-4 w-4 text-[#1ecfc1]" />
              Threat Scanner
            </Link>

            <Link
              to="/community"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive("/community")
                  ? "bg-[#1ecfc1]/15 text-[#1ecfc1] border border-[#1ecfc1]/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              Community Ledger
            </Link>

            <div className="pt-6 mt-4 border-t border-white/10">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg bg-white/5 p-3 text-xs text-gray-400">
                    Signed in as <strong className="text-white block truncate">{user.username || user.email}</strong>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10 cursor-pointer">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setShowMobileMenu(false)}>
                    <Button className="w-full bg-[#1ecfc1] text-gray-950 hover:bg-[#1ecfc1]/90 cursor-pointer">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
