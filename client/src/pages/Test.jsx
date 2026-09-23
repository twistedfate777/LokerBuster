import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Zap,
  ShieldAlert,
  Info,
  Layers,
  Search,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const SAMPLE_SCAM = `PANGGILAN SELEKSI KERJA PT PERTAMINA TAHUN 2026
Selamat kepada Sdr/i! Anda dinyatakan lolos seleksi berkas untuk posisi Staff Administrasi / IT Support dengan gaji Rp 15.000.000/bulan + tunjangan rumah & makan.

Wawancara akan diadakan di Kantor Pusat Jakarta pada hari Senin mendatang.
CATATAN PENTING:
Seluruh akomodasi (tiket pesawat PP & reservasi hotel) WAJIB dipesan melalui agen travel resmi panitia: CV Garuda Tour & Travel (Bpk. Bambang - 08123456789).
Biaya tiket sebesar Rp 1.750.000 akan diganti (reimburse) 100% secara tunai di lokasi tes. Segera transfer sebelum jam 17:00 WIB agar kuota tidak hangus!`;

const SAMPLE_LEGIT = `PT Digital Solusi Indonesia is hiring: Senior Frontend Engineer
Location: Jakarta (Hybrid - 2 days WFO / 3 days WFH)
Salary Range: Rp 22.000.000 - Rp 30.000.000 (Gross) + BPJS + Health Insurance + Annual Bonus

Responsibilities:
- Build high-performance, accessible React/TypeScript web applications.
- Collaborate with Product Managers, UX Designers, and Backend Engineers.
- Optimize frontend architecture and ensure test coverage (>80%).

Requirements:
- 4+ years of professional experience with modern React, Next.js, and TypeScript.
- Strong understanding of REST APIs, state management, and CSS architectures.
- Experience with unit testing (Jest/Vitest).

How to Apply:
Submit your CV and GitHub portfolio through our official careers page at careers.digitalsolusi.co.id or via LinkedIn Jobs. We NEVER ask for any recruitment fees or travel payments.`;

const SCAN_STAGES = [
  "1/4 • Mengurai struktur teks & metadata lowongan...",
  "2/4 • Menganalisis pola NLP & indikasi manipulasi...",
  "3/4 • Memeriksa riwayat entitas & database modus...",
  "4/4 • Mengkalkulasi Scam Score & menyusun laporan...",
];

export default function Test() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("text"); // "text" | "image"
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit (Heuristic #7)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  // Animated Scan Step Progression (Heuristic #1)
  useEffect(() => {
    let interval;
    if (loading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (.jpg, .jpeg, .png, .webp).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const loadSample = (type) => {
    setError("");
    setActiveTab("text");
    removeImage();
    if (type === "scam") {
      setText(SAMPLE_SCAM);
    } else {
      setText(SAMPLE_LEGIT);
    }
  };

  const handleClearAll = () => {
    setText("");
    removeImage();
    setError("");
  };

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (activeTab === "text" && (!text.trim() || text.trim().length < 20)) {
      setError("Mohon masukkan teks lowongan kerja minimal 20 karakter agar analisis akurat.");
      return;
    }

    if (activeTab === "image" && !imageFile) {
      setError("Silakan unggah tangkapan layar atau foto dokumen lowongan kerja.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (activeTab === "image" && imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        res = await api.post("/analyze/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/analyze/", { text: text.trim() });
      }
      navigate("/result", { state: { report: res.data.data } });
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Gagal menganalisis lowongan. Pastikan server aktif dan teks terbaca jelas."
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab, text, imageFile, navigate]);

  return (
    <section className="py-10 sm:py-16 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1ecfc1]/10 border border-[#1ecfc1]/30 text-xs font-semibold text-[#1ecfc1] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Detektor Loker Bodong Real-Time</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Apakah Lowongan Ini <span className="text-[#1ecfc1]">Jebakan?</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl">
          Tempel teks lowongan atau unggah tangkapan layar surat panggilan kerja untuk mendeteksi indikasi penipuan dalam hitungan detik.
        </p>

        {/* Heuristic #3: Zero-Effort Quick Samples */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium">Uji Coba Cepat:</span>
          <button
            type="button"
            onClick={() => loadSample("scam")}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Contoh Loker Bodong (Travel Refund)
          </button>
          <button
            type="button"
            onClick={() => loadSample("legit")}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Contoh Loker Valid (Tech Lead)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Input Form (8 cols) */}
        <div className="lg:col-span-8">
          <div className="cyber-glass-glow rounded-2xl p-5 sm:p-8 relative overflow-hidden">
            {/* Loading Scanner Overlay (Heuristic #1: System Status) */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-[#07090e]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-[#1ecfc1]/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#1ecfc1] border-r-transparent border-b-[#1ecfc1] border-l-transparent animate-spin" />
                    <div className="absolute inset-2 rounded-full border border-blue-500/40 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-[#1ecfc1]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    LokerBuster AI Sedang Bekerja...
                  </h3>
                  <p className="text-sm font-mono text-[#1ecfc1] animate-pulse max-w-sm">
                    {SCAN_STAGES[scanStepIndex]}
                  </p>

                  <div className="w-full max-w-xs bg-slate-900 rounded-full h-1.5 mt-6 overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-[#1ecfc1]"
                      initial={{ width: "15%" }}
                      animate={{ width: `${((scanStepIndex + 1) / SCAN_STAGES.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message with Recovery Tips (Heuristic #9) */}
            {error && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-red-400">Peringatan Input</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Tabs for Input Modes (Heuristic #7: Flexibility) */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("text")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "text"
                      ? "bg-[#1ecfc1]/20 text-[#1ecfc1] border border-[#1ecfc1]/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Input Teks Deskripsi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("image")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "image"
                      ? "bg-[#1ecfc1]/20 text-[#1ecfc1] border border-[#1ecfc1]/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Upload Foto / Tangkapan Layar</span>
                </button>
              </div>

              {(text || imageFile) && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Input Tab */}
              {activeTab === "text" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <label htmlFor="job-text" className="font-medium text-slate-300">
                      Teks Lowongan / Isi Surat Panggilan Kerja
                    </label>
                    <span>{text.length} karakter</span>
                  </div>
                  <textarea
                    id="job-text"
                    rows={8}
                    placeholder="Tempel seluruh deskripsi lowongan kerja, isi email rekruter, atau pesan WhatsApp tawaran kerja di sini..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#1ecfc1] focus:ring-1 focus:ring-[#1ecfc1] resize-y"
                  />
                  <p className="text-[11px] text-slate-500">
                    Tips: Semakin lengkap teks lowongan (nama PT, persyaratan, format gaji, kontak), semakin presisi hasil deteksi.
                  </p>
                </div>
              )}

              {/* Image Upload Tab */}
              {activeTab === "image" && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                    className="hidden"
                    id="image-file-upload"
                  />

                  {!imagePreview ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleImageChange(e.dataTransfer.files?.[0]);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-[#1ecfc1] bg-[#1ecfc1]/10"
                          : "border-white/15 bg-white/[0.02] hover:border-[#1ecfc1]/50 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="p-4 rounded-2xl bg-[#1ecfc1]/10 text-[#1ecfc1] mb-3">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-white">
                        Klik untuk unggah atau seret file gambar ke sini
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Mendukung format PNG, JPG, JPEG, WEBP (Maksimal 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Preview Lowongan"
                        className="max-h-48 rounded-xl object-contain border border-white/10"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-semibold text-sm text-white truncate max-w-xs">
                          {imageFile?.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button & Hotkey hint */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Pintasan: Tekan <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">Ctrl + Enter</kbd> untuk scan
                </span>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#1ecfc1] text-gray-950 font-bold hover:bg-[#1ecfc1]/90 shadow-[0_0_25px_rgba(30,207,193,0.3)] px-8 py-6 text-base rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Scan Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar: Heuristic #6 Red Flags Checklist & Guidance (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cyber-glass rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Daftar Red Flags Loker Bodong</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Berikut adalah indikator utama yang dievaluasi oleh engine kami:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 font-bold">1.</span>
                <span><strong>Pungutan Biaya:</strong> Meminta bayaran tiket travel, hotel, seragam, atau pelatihan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 font-bold">2.</span>
                <span><strong>Kontak Gratisan:</strong> Menggunakan domain @gmail.com / @yahoo.com untuk perusahaan besar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 font-bold">3.</span>
                <span><strong>Gaji Fantastis:</strong> Menjanjikan puluhan juta tanpa kualifikasi atau interview formal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 font-bold">4.</span>
                <span><strong>Desakan Waktu (Urgency Trap):</strong> Batas konfirmasi sangat singkat agar korban panik.</span>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-[#1ecfc1]/10 border border-[#1ecfc1]/20 text-[#1ecfc1] text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Privasi Terjamin: Kami tidak menyimpan data sensitif identitas Anda.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
