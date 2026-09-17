import { MenuIcon, SearchAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setShowMobileMenu(false);
    await logout();
    navigate("/");
  };

  if (loading) return null;

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild
            >
              <Link to={user ? "/test" : "/login"} onClick={() => setShowMobileMenu(false)}>
                <SearchAlert className="w-4 h-4" />
                Scan
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild
            >
              <Link to="/community" onClick={() => setShowMobileMenu(false)}>
                <Users className="w-4 h-4" />
                Community
              </Link>
            </Button>
            {user ? (
              <div className="flex items-center justify-center">
                <Button
                  className="min-w-[100px] cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Button className="min-w-[100px] cursor-pointer" asChild>
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    Login
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
