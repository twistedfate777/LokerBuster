import { MenuIcon, SearchAlert, Users, Shield, LogOut, HelpCircle } from "lucide-react";
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

function MobileNavbar({ onOpenGuide }) {
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

  return (
    <div className="flex md:hidden items-center">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[310px] cyber-glass border-l border-white/10 p-6 bg-[#090d16]/95">
          <SheetHeader className="text-left pb-4 border-b border-white/10">
            <SheetTitle className="flex items-center gap-2 font-mono text-lg text-white">
              <Shield className="w-5 h-5 text-[#1ecfc1]" />
              <span>Loker<span className="text-[#1ecfc1]">Buster</span></span>
            </SheetTitle>
          </SheetHeader>

          {/* Engine Status Pill */}
          <div className="my-4 flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Engine Online (99.4% Acc)</span>
          </div>

          <nav className="flex flex-col space-y-3 mt-4">
            <Button
              variant="ghost"
              className={`flex items-center gap-3 justify-start px-3 py-2.5 rounded-xl ${
                location.pathname === "/test"
                  ? "bg-[#1ecfc1]/20 text-[#1ecfc1] font-semibold border border-[#1ecfc1]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
              asChild
            >
              <Link to={user ? "/test" : "/login"} onClick={() => setShowMobileMenu(false)}>
                <SearchAlert className="w-4 h-4 text-[#1ecfc1]" />
                <span>Scan Lowongan</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className={`flex items-center gap-3 justify-start px-3 py-2.5 rounded-xl ${
                location.pathname === "/community"
                  ? "bg-[#1ecfc1]/20 text-[#1ecfc1] font-semibold border border-[#1ecfc1]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
              asChild
            >
              <Link to="/community" onClick={() => setShowMobileMenu(false)}>
                <Users className="w-4 h-4 text-blue-400" />
                <span>Community Ledger</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
              onClick={() => {
                setShowMobileMenu(false);
                if (onOpenGuide) onOpenGuide();
              }}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Panduan Scam 101</span>
            </Button>

            <div className="h-px bg-white/10 my-4" />

            {user ? (
              <div className="flex flex-col gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-slate-400">Masuk sebagai</p>
                  <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full bg-[#1ecfc1] text-gray-950 font-semibold" asChild>
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-white/10" asChild>
                  <Link to="/register" onClick={() => setShowMobileMenu(false)}>
                    Daftar Akun
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
