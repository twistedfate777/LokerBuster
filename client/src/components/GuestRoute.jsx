import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function GuestRoute({ children, redirectTo = "/test" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1ecfc1] border-t-transparent" />
      </div>
    );
  }

  if (user) {
    const destination = location.state?.from?.pathname || redirectTo;
    return <Navigate to={destination} replace />;
  }

  return children;
}
