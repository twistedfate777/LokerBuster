import { Link, useNavigate } from "react-router-dom";
import { SearchAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl  text-primary font-bold font-mono tracking-wider"
            >
              <span>Loker</span>
              <span className="text-[#1ecfc1]">Buster</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 items-center">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              asChild
            >
              <Link to={user ? "/test" : "/login"}>
                <SearchAlert className="w-4 h-4" />
                <span className="hidden lg:inline">Scan</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link to="/community">
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">Community</span>
              </Link>
            </Button>
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.username}
                </span>
                <Button
                  className="cursor-pointer px-4 hover:opacity-90"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button className="cursor-pointer px-4 hover:opacity-90" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
