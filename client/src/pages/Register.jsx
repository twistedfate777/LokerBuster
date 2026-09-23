import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, User, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal harus 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), username.trim(), password);
      navigate("/test");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Gagal mendaftar akun. Email atau username mungkin sudah terdaftar."
      );
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
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#1ecfc1]/20 to-blue-500/20 border border-[#1ecfc1]/40 mb-4">
            <Shield className="w-8 h-8 text-[#1ecfc1]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Buat Akun Baru</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bergabunglah dan lindungi diri dari penipuan lowongan kerja.
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
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5" htmlFor="reg-email">
              <Mail className="w-3.5 h-3.5 text-[#1ecfc1]" /> Alamat Email
            </label>
            <Input
              id="reg-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 py-3 rounded-xl focus:border-[#1ecfc1]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5" htmlFor="reg-username">
              <User className="w-3.5 h-3.5 text-[#1ecfc1]" /> Nama Pengguna (Username)
            </label>
            <Input
              id="reg-username"
              type="text"
              placeholder="contoh: budi_santoso"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 py-3 rounded-xl focus:border-[#1ecfc1]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5" htmlFor="reg-password">
              <Lock className="w-3.5 h-3.5 text-[#1ecfc1]" /> Kata Sandi (Min. 8 Karakter)
            </label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 py-3 rounded-xl focus:border-[#1ecfc1]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5" htmlFor="reg-confirm-password">
              <Lock className="w-3.5 h-3.5 text-[#1ecfc1]" /> Konfirmasi Kata Sandi
            </label>
            <Input
              id="reg-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-slate-950/80 border-white/10 text-white placeholder:text-slate-500 py-3 rounded-xl focus:border-[#1ecfc1]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#1ecfc1] text-gray-950 font-bold hover:bg-[#1ecfc1]/90 shadow-[0_0_20px_rgba(30,207,193,0.3)] py-6 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? "Mendaftarkan..." : "Daftar Akun Sekarang"}
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#1ecfc1] hover:underline font-semibold">
              Masuk di Sini
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}

export default Register;
