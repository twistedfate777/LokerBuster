import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion as Motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

function Login() {
  const { login, bypassLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    setError("");
    bypassLogin();
    navigate("/test");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/test");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-full max-w-lg overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-[#1ecfc1]/20 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090e1c]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1ecfc1]/40 bg-gradient-to-br from-[#1ecfc1]/20 via-[#0f172a] to-[#070a13] text-[#1ecfc1] shadow-[0_0_15px_-3px_rgba(30,207,193,0.3)] mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sign In to LokerBuster
            </h1>
            <p className="mt-1.5 text-xs text-gray-400">
              Access real-time job scam detection and threat reports.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="font-mono text-xs text-gray-300 uppercase block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="analyst@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#060a14] pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="font-mono text-xs text-gray-300 uppercase block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#060a14] pl-10 pr-10 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#1ecfc1] text-gray-950 font-semibold py-5 text-sm hover:bg-[#1ecfc1]/90 shadow-[0_0_20px_-3px_rgba(30,207,193,0.4)] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying Credentials..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#090e1c] px-3 font-mono text-[10px] text-gray-400 uppercase">
                or instant access
              </span>
            </div>

            {/* Demo Guest Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-200 hover:bg-white/10 hover:border-[#1ecfc1]/30 hover:text-[#1ecfc1] transition-all cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-[#1ecfc1]" />
              Continue as Guest Analyst
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#1ecfc1] hover:underline">
              Create one for free
            </Link>
          </p>
        </Motion.div>
      </div>
    </section>
  );
}

export default Login;
