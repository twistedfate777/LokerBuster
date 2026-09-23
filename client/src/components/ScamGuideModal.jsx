import React from "react";
import {
  AlertTriangle,
  Plane,
  CreditCard,
  Building,
  Mail,
  CheckCircle2,
  X,
  HelpCircle,
} from "lucide-react";

const SCAM_MODUSES = [
  {
    icon: Plane,
    title: "1. Modus Surat Panggilan Tes & Travel Refund",
    badge: "Paling Sering Terjadi",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    description:
      "Korban menerima email panggilan tes wawancara palsu yang mencatut nama BUMN atau korporasi besar (Pertamina, PLN, Telkom, dll.). Diwajibkan memesan tiket pesawat & hotel melalui agen travel tertentu dengan iming-iming 'uang akan diganti/reimburse saat tiba di lokasi'.",
    redFlags: [
      "Format PDF surat panggilan berantakan atau mencantumkan puluhan nama peserta sekaligus.",
      "Harus transfer biaya tiket ke rekening perorangan agen travel.",
      "Email pengirim bukan domain resmi perusahaan (misal: hrd-pertamina@gmail.com).",
    ],
    safeAction: "Perusahaan bonafide TIDAK PERNAH memungut biaya transportasi atau mewajibkan agen travel tertentu.",
  },
  {
    icon: CreditCard,
    title: "2. Modus Biaya Seragam, Pelatihan, & Administrasi",
    badge: "Sering di Ruko / PT Fiktif",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    description:
      "Pelamar langsung dinyatakan 'diterima tanpa tes wawancara formal', namun diminta membayar sejumlah uang di muka untuk biaya seragam, sertifikat kerja, atau ID card.",
    redFlags: [
      "Wawancara diadakan di ruko terpencil tanpa plang perusahaan yang jelas.",
      "Meminta uang tunai/transfer di hari pertama sebelum ada kontrak kerja resmi.",
      "Menahan ijazah asli tanpa kejelasan hukum atau tanda terima berlegalitas.",
    ],
    safeAction: "Jangan pernah memberikan uang sepeser pun atau menyerahkan dokumen asli tanpa tanda terima sah.",
  },
  {
    icon: Mail,
    title: "3. Modus Undangan WhatsApp / Telegram Freelance Like & Subscribe",
    badge: "Scam Online Modern",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description:
      "Ditawari pekerjaan paruh waktu 'hanya like video YouTube / follow akun e-commerce' dengan imbalan puluhan hingga ratusan ribu rupiah. Di awal dibayar sedikit, lalu diarahkan deposit uang besar untuk 'tugas level tinggi' dan uang tidak bisa ditarik.",
    redFlags: [
      "Menghubungi tiba-tiba melalui nomor luar negeri (+62 abal-abal / +1 dsb) di WhatsApp atau Telegram.",
      "Menjanjikan passive income jutaan per hari hanya dari klik tombol.",
      "Meminta deposit bertahap ke rekening pribadi.",
    ],
    safeAction: "Segera blokir nomor pengirim. Tidak ada pekerjaan sah yang meminta pelamar deposit uang untuk tugas kerja.",
  },
  {
    icon: Building,
    title: "4. Modus Perusahaan Hantu / Ghost Company",
    badge: "Pencurian Data Identitas",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description:
      "Membuka lowongan dengan deskripsi menarik di media sosial hanya untuk mengumpulkan foto KTP, KK, selfie dengan KTP, dan nomor rekening pelamar guna dipakai mendaftar pinjol ilegal atau rekening penampungan judi online.",
    redFlags: [
      "Tidak ada website resmi, akun LinkedIn resmi, atau jejak digital kantor.",
      "Formulir lamaran langsung meminta foto KTP dan nomor rekening bank di tahap awal sebelum interview.",
    ],
    safeAction: "Watermark foto KTP Anda dengan teks 'HANYA UNTUK LAMARAN KERJA [NAMA PT]' sebelum mengunggahnya.",
  },
];

export default function ScamGuideModal({ open, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl cyber-glass border border-[#1ecfc1]/40 shadow-2xl p-6 sm:p-8 bg-[#090d16]">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Tutup Panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#1ecfc1]/20 text-[#1ecfc1]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Panduan Deteksi & Modus Loker Bodong (Scam Buster 101)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Pelajari ciri-ciri modus penipuan lowongan kerja paling umum di Indonesia.
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10 my-4" />

        {/* Modus List */}
        <div className="space-y-6">
          {SCAM_MODUSES.map((modus, idx) => {
            const Icon = modus.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-5 h-5 text-[#1ecfc1]" />
                    <h3 className="font-semibold text-sm sm:text-base text-white">
                      {modus.title}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${modus.badgeColor}`}>
                    {modus.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
                  {modus.description}
                </p>

                {/* Red Flags Bullet */}
                <div className="mb-3 space-y-1.5 bg-red-500/5 p-3 rounded-lg border border-red-500/20">
                  <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Indikator Red Flags:
                  </div>
                  <ul className="space-y-1 text-xs text-red-300/90 pl-1">
                    {modus.redFlags.map((rf, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safe Action */}
                <div className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Solusi Aman:</strong> {modus.safeAction}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Menemukan lowongan mencurigakan? Lakukan scan instan di LokerBuster.
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#1ecfc1] text-gray-950 font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
