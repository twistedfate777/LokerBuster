import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  X,
  SearchCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Terminal,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Lock,
} from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const SAMPLE_PRESETS = [
  {
    label: "Telegram Crypto Scam",
    text: "URGENT HIRING: Remote Data Entry Operator. Salary $4,500/week. No interview needed! Contact HR Manager via Telegram @CareerGlobalHR. Must deposit $50 refundable registration fee before receiving company laptop.",
  },
  {
    label: "WhatsApp Ghost Recruiter",
    text: "Hi! I am Jessica from Amazon Recruitment. We reviewed your profile and want to offer you a Part-Time Rating Assistant job. Earn $300-$800 daily by completing 15 product reviews. Reply YES to start.",
  },
  {
    label: "Verified Frontend Role",
    text: "Senior Frontend Engineer at Stripe. Requirements: 4+ years of React, TypeScript, and modern CSS. Competitive salary ($140k-$180k), equity, 401(k), and comprehensive health benefits. Apply via official stripe.com/jobs portal.",
  },
];

const SCAN_STAGES = [
  "Extracting job parameters & recruiter claims...",
  "Running NLP deception & fee extortion analysis...",
  "Cross-referencing corporate domain history...",
  "Generating final threat intelligence dossier...",
];

const getAnalysisError = (error) => {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.error?.message;

  if (!error.response) {
    return {
      title: "Connection problem",
      message: "We could not reach the analysis service.",
      hint: "Check your internet connection, then try the scan again.",
      retryable: true,
    };
  }

  if (status === 400) {
    return {
      title: "Please check your input",
      message: serverMessage || "Some required job information is missing or invalid.",
      hint: "Add more job details and submit the scan again.",
      retryable: false,
    };
  }

  if (status === 422) {
    return {
      title: "This content could not be analyzed",
      message: serverMessage || "The screenshot or job text did not contain enough usable information.",
      hint: "Use a clearer screenshot or paste the complete job posting.",
      retryable: false,
    };
  }

  if (status >= 500) {
    return {
      title: "Analysis service unavailable",
      message: "Our OCR or AI service is temporarily unavailable.",
      hint: serverMessage || "Wait a moment and try the scan again.",
      retryable: true,
    };
  }

  return {
    title: "Analysis could not be completed",
    message: serverMessage || "Something unexpected interrupted the scan.",
    hint: "Please try again. If the problem continues, use a different job input.",
    retryable: true,
  };
};

function Test() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("text"); // "text" | "image"
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError({
        title: "Screenshot is too large",
        message: "The selected file is larger than the 5MB upload limit.",
        hint: "Choose a smaller JPG or PNG screenshot, then try again.",
        retryable: false,
      });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (activeTab === "text" && !text.trim()) {
      setError({
        title: "Job details are missing",
        message: "There is no job text to scan yet.",
        hint: "Paste the job description, recruiter message, or job link into the text box.",
        retryable: false,
      });
      return;
    }

    if (activeTab === "image" && !imageFile) {
      setError({
        title: "Screenshot is missing",
        message: "No job screenshot has been selected.",
        hint: "Choose a clear JPG or PNG screenshot before starting the scan.",
        retryable: false,
      });
      return;
    }

    setLoading(true);
    setStageIndex(0);

    // Simulate scanning progress stages
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      let res;
      if (activeTab === "image" && imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        res = await api.post("/analyze/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/analyze/", { text });
      }
      clearInterval(stageInterval);
      navigate("/result", { state: { report: res.data.data } });
    } catch (err) {
      clearInterval(stageInterval);
      setError(getAnalysisError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-5xl overflow-hidden opacity-25">
        <div className="absolute top-0 left-1/4 h-[350px] w-[500px] rounded-full bg-[#1ecfc1]/20 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Terminal Header */}
        <div className="text-center mb-8">
          

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            Scan a Job Offer for Red Flags
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl mx-auto"
          >
            Paste job text, recruitment chats, or upload job screenshots. Our AI analyzes metadata, salary realism, and payment demands.
          </motion.p>
        </div>

        {/* Scanner Terminal Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090f1e]/90 shadow-2xl backdrop-blur-2xl"
        >
          {/* Terminal Title Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/[0.02] px-6 py-3.5">
            <div className="flex items-center gap-2 rounded-lg border border-[#1ecfc1]/15 bg-[#1ecfc1]/[0.04] px-2.5 py-1.5 shadow-[0_0_18px_-10px_rgba(30,207,193,0.8)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[#1ecfc1]/25 bg-[#1ecfc1]/10 text-[#1ecfc1]">
                <Cpu className="h-3 w-3" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
                Powered by <strong className="font-semibold text-[#1ecfc1]">QWEN</strong>
              </span>
            </div>

            {/* Input Mode Tabs */}
            <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("text");
                  setError(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  activeTab === "text"
                    ? "bg-[#1ecfc1] text-gray-950 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Text Input
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("image");
                  setError(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  activeTab === "image"
                    ? "bg-[#1ecfc1] text-gray-950 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Screenshot OCR
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                aria-live="assertive"
                className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-400/40 bg-red-500/[0.12] p-4 shadow-[0_0_24px_-12px_rgba(248,113,113,0.8)] sm:flex-row sm:items-start"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-300/40 bg-red-400/15">
                    <AlertCircle className="h-5 w-5 text-red-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-red-100">{error.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-red-200/90">{error.message}</p>
                    <p className="mt-2 text-xs leading-relaxed text-red-200/70">
                      <span className="font-semibold text-red-100">Next step:</span> {error.hint}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
                  {error.retryable && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-300/30 bg-red-400/15 px-3 py-2 text-xs font-semibold text-red-100 transition-colors hover:bg-red-400/25"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Try again
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-200/70 transition-colors hover:bg-red-400/15 hover:text-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Text Mode */}
            {activeTab === "text" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="job-text" className="font-mono text-xs text-gray-300 uppercase tracking-wider">
                    Job Description / Offer Text
                  </label>
                  <span className="font-mono text-xs text-gray-400">
                    {text.length} characters
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="job-text"
                    rows={6}
                    placeholder="Paste email, WhatsApp/Telegram message, job link, or requirements here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/10 bg-[#060a14] px-4 py-3.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 leading-relaxed font-sans transition-all resize-y min-h-[160px]"
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                  {text && (
                    <button
                      type="button"
                      onClick={() => setText("")}
                      className="absolute top-3 right-3 text-xs text-gray-400 hover:text-white bg-white/5 rounded-md px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sample Presets */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-mono">
                    <Sparkles className="h-3 w-3 text-[#1ecfc1]" />
                    <span>Quick-fill test samples:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PRESETS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setText(sample.text);
                          setError(null);
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 hover:border-[#1ecfc1]/40 hover:bg-[#1ecfc1]/10 hover:text-[#1ecfc1] transition-all"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Image Mode */}
            {activeTab === "image" && (
              <div className="flex flex-col gap-4">
                <label className="font-mono text-xs text-gray-300 uppercase tracking-wider">
                  Upload Screenshot (JPG, PNG)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-file-input"
                  disabled={loading}
                />

                {!imagePreview ? (
                  <label
                    htmlFor="image-file-input"
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-[#060a14] py-12 px-6 text-center cursor-pointer hover:border-[#1ecfc1]/50 hover:bg-[#1ecfc1]/5 transition-all group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-400 group-hover:border-[#1ecfc1]/40 group-hover:text-[#1ecfc1] group-hover:scale-105 transition-all mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-200">
                      Click to upload or drag and drop screenshot
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Supports PNG, JPG up to 5MB
                    </p>
                  </label>
                ) : (
                  <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#060a14] p-4">
                    <img
                      src={imagePreview}
                      alt="Uploaded Screenshot"
                      className="max-h-[260px] rounded-xl border border-white/10 object-contain"
                    />
                    <div className="mt-3 flex items-center justify-between w-full max-w-sm px-2">
                      <span className="font-mono text-xs text-gray-300 truncate">
                        {imageFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg px-2.5 py-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scanning Progress Overlay */}
            {loading && (
              <div className="my-6 rounded-2xl border border-[#1ecfc1]/30 bg-[#1ecfc1]/5 p-5 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1ecfc1] opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#1ecfc1]" />
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#1ecfc1]">
                    ANALYZING THREAT VECTORS...
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-300 font-mono">
                  {SCAN_STAGES[stageIndex]}
                </p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1ecfc1]"
                    initial={{ width: "10%" }}
                    animate={{ width: `${((stageIndex + 1) / SCAN_STAGES.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#1ecfc1]" />
                Zero data retention • In-memory validation
              </span>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1ecfc1] text-gray-950 px-8 py-6 font-semibold text-base shadow-[0_0_25px_-5px_rgba(30,207,193,0.5)] hover:bg-[#1ecfc1]/90 hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Cpu className="h-5 w-5 animate-spin" />
                    Processing Threat Scan...
                  </>
                ) : (
                  <>
                    <SearchCheck className="h-5 w-5" />
                    Scan This Job Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default Test;
