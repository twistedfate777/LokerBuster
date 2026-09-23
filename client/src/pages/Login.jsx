import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Sparkles, UserCheck, AlertTriangle } from "lucide-react";

function Login() {
  const { login, bypassLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await login(email.trim(), password);
      navigate("/test");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Email atau kata sandi tidak cocok. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-20 mx-auto w-full max-w-lg px-4 flex flex-col justify-center items-center min-h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full cyber-glass-glow rounded-3xl p-6 sm:p-10 border border-white/10"
      >
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#1ecfc1]/20 to-blue-500/20 border border-[#1ecfc1]/40 mb-4">
            <Shield className="w-8 h-8 text-[#1ecfc1]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Selamat Datang Kembali</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Masuk ke akun LokerBuster untuk memindai lowongan kerja.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5" htmlFor="login-email">
              <Mail className="w-3.5 h-3.5 text-[#1ecfc1]" /> Email
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 py-3 rounded-xl focus:border-[#1ecfc1]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5" htmlFor="login-password">
              <Lock className="w-3.5 h-3.5 text-[#1ecfc1]" /> Kata Sandi
            </label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 py-3 rounded-xl focus:border-[#1ecfc1]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#1ecfc1] text-gray-950 font-bold hover:bg-[#1ecfc1]/90 shadow-[0_0_20px_rgba(30,207,193,0.3)] py-6 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Akun"}
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="h-px bg-white/10 w-full" />
            <span className="absolute bg-[#0b0f19] px-3 text-[11px] text-slate-500">atau</span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full border-white/10 hover:border-[#1ecfc1]/40 bg-white/[0.02] hover:bg-white/[0.06] text-slate-200 py-5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <UserCheck className="w-4 h-4 text-[#1ecfc1]" />
            <span>Lanjutkan sebagai Tamu (Roblox Guest)</span>
          </Button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="text-[#1ecfc1] hover:underline font-semibold">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}

export default Login;
