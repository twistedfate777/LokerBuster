import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Info,
} from "lucide-react";
import { DataEntryNode, AIDeepScanNode, SafetyVerdictNode } from "./ScaleArchitectureDiagram";

const NODE_INFO = [
  {
    id: 1,
    title: "Holographic Job Ingestion",
    subtitle: "Node 01: Data Layer Extraction",
    icon: FileText,
    color: "#60a5fa",
    bgAccent: "from-blue-500/10 to-transparent",
    borderAccent: "border-blue-500/30",
    badge: "Layer 1: Input Ingestion",
    description:
      "Mengekstraksi struktur semantik lowongan kerja, metadata pengirim, domain alamat email rekruter, dan rentang gaji yang dijanjikan ke dalam vektor fitur neural.",
    metrics: [
      { label: "Parsing Rate", value: "1,200 chars/s" },
      { label: "Format Support", value: "Text & Image OCR" },
      { label: "Entity Extraction", value: "Company, Role, Fee" },
    ],
  },
  {
    id: 2,
    title: "Quantum Neural DeepScan",
    subtitle: "Node 02: AI Pattern Radar",
    icon: Cpu,
    color: "#1ecfc1",
    bgAccent: "from-[#1ecfc1]/10 to-transparent",
    borderAccent: "border-[#1ecfc1]/30",
    badge: "Layer 2: NLP Detection",
    description:
      "Memindai pola linguistik manipulatif, desakan waktu palsu (urgency traps), permintaan biaya seleksi/travel terselubung, dan riwayat reputasi entitas.",
    metrics: [
      { label: "Pattern Models", value: "NLP Multi-head" },
      { label: "Inference Latency", value: "< 850 ms" },
      { label: "Threat DB Match", value: "Real-time Sync" },
    ],
  },
  {
    id: 3,
    title: "Cyber Sentinel Isolator",
    subtitle: "Node 03: Verdict & Threat Lock",
    icon: ShieldCheck,
    color: "#10b981",
    bgAccent: "from-emerald-500/10 to-transparent",
    borderAccent: "border-emerald-500/30",
    badge: "Layer 3: Security Verdict",
    description:
      "Menghasilkan kalkulasi Scam Score akhir (0-100), tingkat keyakinan (Confidence Level), serta memilah indikator risiko Red Flags & Green Flags secara transparan.",
    metrics: [
      { label: "Confidence Metric", value: "0 - 100% Index" },
      { label: "Decision Engine", value: "Bayesian Ensemble" },
      { label: "Ledger Logging", value: "Community Protected" },
    ],
  },
];

export default function ThreeThreatLab() {
  const [activeTab, setActiveTab] = useState(1);
  const [threatState, setThreatState] = useState("SECURE");
  const [autoRotate, setAutoRotate] = useState(true);

  const activeNode = NODE_INFO.find((n) => n.id === activeTab) || NODE_INFO[0];

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1ecfc1]/10 border border-[#1ecfc1]/30 text-[#1ecfc1] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive 3D Engine Workbench
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Cara Kerja <span className="text-[#1ecfc1]">LokerBuster AI</span> di Balik Layar
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2">
          Eksplorasi 3 arsitektur visual utama kami. Klik node untuk melihat interaksi 3D, putar model, dan uji respons isolasi ancaman.
        </p>
      </div>

      {/* Tab Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {NODE_INFO.map((node) => {
          const Icon = node.icon;
          const isActive = activeTab === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveTab(node.id)}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-all duration-300 border ${
                isActive
                  ? `bg-slate-900/90 border-[#1ecfc1] shadow-[0_0_20px_rgba(30,207,193,0.2)] text-white`
                  : `bg-slate-950/40 border-white/5 hover:border-white/20 text-slate-400 hover:text-slate-200`
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                  isActive ? "bg-[#1ecfc1]/20 text-[#1ecfc1]" : "bg-white/5 text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-mono block text-slate-500">{node.subtitle}</span>
                <span className="font-semibold text-sm sm:text-base truncate block text-slate-100">
                  {node.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 3D Canvas + Info Card Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3D Interactive Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 relative h-[380px] sm:h-[450px] rounded-2xl cyber-glass-glow overflow-hidden flex flex-col">
          {/* Controls Bar Overlay */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-300 pointer-events-auto">
              {activeNode.badge}
            </span>
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all border ${
                  autoRotate
                    ? "bg-[#1ecfc1]/20 text-[#1ecfc1] border-[#1ecfc1]/40"
                    : "bg-black/50 text-slate-400 border-white/10"
                }`}
                title="Toggle Auto Rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
                <span>{autoRotate ? "Auto-Spin ON" : "Rotate OFF"}</span>
              </button>
            </div>
          </div>

          {/* Interactive State Switcher for Node 3 */}
          {activeTab === 3 && (
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 hidden sm:inline mr-1">Simulasi State:</span>
              <button
                onClick={() => setThreatState("SECURE")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  threatState === "SECURE"
                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/60"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Aman
              </button>
              <button
                onClick={() => setThreatState("CAUTION")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  threatState === "CAUTION"
                    ? "bg-amber-500/30 text-amber-300 border border-amber-500/60"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Berisiko
              </button>
              <button
                onClick={() => setThreatState("THREAT")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  threatState === "THREAT"
                    ? "bg-red-500/30 text-red-300 border border-red-500/60"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Scam
              </button>
            </div>
          )}

          {/* 3D Scene */}
          <Canvas
            camera={{ position: [0, 2.2, 6.2], fov: 42 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[6, 10, 6]} intensity={2.2} color="#ffffff" />
            <pointLight position={[-5, 5, -3]} intensity={1.5} color="#3b82f6" />
            <pointLight position={[5, 5, 3]} intensity={1.5} color={activeNode.color} />

            <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.25}>
              <group position={[0, -0.8, 0]}>
                {activeTab === 1 && <DataEntryNode position={[0, 0, 0]} scale={1.2} isInteractive />}
                {activeTab === 2 && <AIDeepScanNode position={[0, 0, 0]} scale={1.2} isInteractive />}
                {activeTab === 3 && (
                  <SafetyVerdictNode
                    position={[0, 0, 0]}
                    scale={1.2}
                    threatState={threatState}
                  />
                )}
              </group>
            </Float>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              maxPolarAngle={Math.PI / 1.9}
              minPolarAngle={Math.PI / 4.5}
            />
          </Canvas>
        </div>

        {/* Node Information & Telemetry Specs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl cyber-glass border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-[#1ecfc1] font-semibold">
                  {activeNode.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeNode.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeNode.description}
              </p>

              {/* Telemetry Metrics Box */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-[#1ecfc1]" />
                  Spesifikasi Pipeline
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  {activeNode.metrics.map((m, idx) => (
                    <div key={idx} className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                      <p className="text-[10px] text-slate-400">{m.label}</p>
                      <p className="text-xs font-semibold text-slate-200 mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usability Guidance Note */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>
                  Hasil analisis ini dievaluasi otomatis untuk melindungi Anda dari jebakan rekrutmen tanpa mengorbankan privasi data.
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Interaktif 360° Drag View</span>
            <span className="text-[#1ecfc1] font-mono">Status: Active Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
