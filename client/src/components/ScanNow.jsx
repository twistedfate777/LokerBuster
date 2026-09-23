import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ScanNow() {
  const { user } = useAuth();

  return (
    <section className="py-16 sm:py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1ecfc1]/5 to-transparent pointer-events-none" />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="rounded-3xl cyber-glass-glow p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle Ambient Shapes */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#1ecfc1]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1ecfc1]/10 border border-[#1ecfc1]/30 text-xs text-[#1ecfc1] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gratis • Tanpa Perlu Kartu Kredit</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Jangan Pertaruhkan Masa Depan Anda pada{" "}
            <span className="text-[#1ecfc1]">Lowongan Palsu.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Hanya butuh 5 detik untuk memverifikasi keaslian lowongan kerja dan terhindar dari kerugian jutaan rupiah.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? "/test" : "/login"}>
              <Button className="w-full sm:w-auto bg-[#1ecfc1] text-gray-950 font-bold hover:bg-[#1ecfc1]/90 shadow-[0_0_25px_rgba(30,207,193,0.35)] px-8 py-6 text-base rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                <Zap className="w-5 h-5 fill-current" />
                <span>Mulai Scan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/community">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 px-6 py-6 text-base rounded-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Cek Database Komunitas</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ScanNow;
