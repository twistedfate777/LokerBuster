import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  X,
  SearchCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Cpu,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
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

const MIN_TEXT_LENGTH = 20;
const MAX_TEXT_LENGTH = 10000;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg"]);

const OCR_ERRORS = {
  unsupported_image_type: {
    title: "Unsupported image type",
    message: "This image format isn't supported.",
    hint: "Choose a PNG or JPEG image.",
    retryable: false,
  },
  image_too_large: {
    title: "Screenshot is too large",
    message: "The selected image exceeds the 5 MB upload limit.",
    hint: "Choose a smaller screenshot, then try again.",
    retryable: false,
  },
  invalid_image: {
    title: "Invalid screenshot",
    message: "The uploaded file could not be opened as an image.",
    hint: "Choose a valid PNG or JPEG screenshot.",
    retryable: false,
  },
  ocr_unavailable: {
    title: "OCR services unavailable",
    message: "Neither local Tesseract nor OCR Space is available to read this screenshot.",
    hint: "Check the backend's TESSERACT_CMD and OCR_API_KEY settings.",
    retryable: false,
  },
  ocr_space_timeout: {
    title: "OCR Space timed out",
    message: "The cloud OCR service did not respond before its time limit.",
    hint: "Wait a moment, then retry the screenshot scan.",
    retryable: true,
  },
  ocr_space_unavailable: {
    title: "OCR Space is unreachable",
    message: "The backend could not connect to the cloud OCR service.",
    hint: "Check the backend's internet connection, then retry the screenshot scan.",
    retryable: true,
  },
  ocr_space_processing_failed: {
    title: "OCR Space could not process the screenshot",
    message: "The cloud OCR service returned an invalid response or could not read this image.",
    hint: "Try another screenshot or paste the job text instead.",
    retryable: true,
  },
  ocr_processing_failed: {
    title: "Screenshot could not be read",
    message: "OCR failed while extracting text from this image.",
    hint: "Use a sharper screenshot or paste the job text instead.",
    retryable: false,
  },
  no_text_found: {
    title: "No text found in screenshot",
    message: "The image does not contain readable job-posting text.",
    hint: "Upload a screenshot showing the job details, or paste the text instead.",
    retryable: false,
  },
};

const EXTRACTOR_ERRORS = {
  extractor_not_configured: {
    title: "AI service is not configured",
    message: "The AI analyzer is missing its Groq credentials.",
    hint: "Configure GROQ_API_KEY in the backend environment.",
    retryable: false,
  },
  extractor_connection_failed: {
    title: "AI service unreachable",
    message: "The scanner could not connect to Groq.",
    hint: "Check the backend's internet connection, then try again.",
    retryable: true,
  },
  extractor_timeout: {
    title: "AI service timed out",
    message: "Groq did not respond before the request timed out.",
    hint: "Wait for the connection to recover, then try again.",
    retryable: true,
  },
  extractor_request_failed: {
    title: "AI provider rejected the request",
    message: "Groq could not process the analysis request.",
    hint: "Check the Groq API key, model access, and account limits.",
    retryable: true,
  },
  extractor_invalid_response: {
    title: "AI response could not be processed",
    message: "The AI analyzer returned a response the scanner could not use.",
    hint: "Try again. If it continues, check the configured Groq model.",
    retryable: true,
  },
  extractor_failure: {
    title: "AI analysis failed",
    message: "The AI analyzer could not complete this scan.",
    hint: "Try again. If the issue continues, check the extractor service logs.",
    retryable: true,
  },
};

const getAnalysisError = (error) => {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.error?.message;
  const serverErrorCode = error.response?.data?.error?.code;

  if (!error.response) {
    return {
      title: "Scanner server unavailable",
      message: "We could not reach the LokerBuster backend.",
      hint: "Check that the backend is running, then try again.",
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
    if (serverErrorCode === "not_job_posting") {
      return {
        title: "Not a job listing",
        message: "This item doesn't appear to contain a job listing we can analyze.",
        hint: "Upload a job ad or paste a recruiter message with role details.",
        retryable: false,
      };
    }

    if (OCR_ERRORS[serverErrorCode]) return OCR_ERRORS[serverErrorCode];

    return {
      title: "This content could not be analyzed",
      message: serverMessage || "The submitted content could not be analyzed.",
      hint: "Check the submitted job details and try again.",
      retryable: false,
    };
  }

  if (status === 502) {
    return EXTRACTOR_ERRORS[serverErrorCode] || EXTRACTOR_ERRORS.extractor_failure;
  }

  if (status >= 500) {
    return {
      title: "Scanner server error",
      message: "The backend could not complete this scan.",
      hint: "Try again later. If the problem continues, check the backend logs.",
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
  const requestControllerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("text"); // "text" | "image"
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => requestControllerRef.current?.abort();
  }, []);

  const setUploadedImage = (file) => {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setError({
        title: "Unsupported image type",
        message: "Only PNG and JPEG images can be scanned.",
        hint: "Choose or paste a PNG or JPEG image.",
        retryable: false,
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
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
    setError(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setUploadedImage(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaste = (event) => {
    const imageItems = Array.from(event.clipboardData.items).filter((item) =>
      item.type.startsWith("image/")
    );
    if (!imageItems.length) return;

    event.preventDefault();
    const imageItem = imageItems.find((item) => ACCEPTED_IMAGE_TYPES.has(item.type));
    if (!imageItem) {
      setError({
        title: "Unsupported image type",
        message: "Only PNG and JPEG images can be scanned.",
        hint: "Copy a PNG or JPEG image, then paste it again.",
        retryable: false,
      });
      return;
    }

    const pastedBlob = imageItem.getAsFile();
    if (!pastedBlob) return;

    const fileExtension = pastedBlob.type.split("/")[1] || "png";
    const pastedFile = new File([pastedBlob], `pasted-image.${fileExtension}`, {
      type: pastedBlob.type,
    });

    setActiveTab("image");
    setUploadedImage(pastedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    setActiveTab("image");
    setUploadedImage(file);
  };

  const handleCancelScan = () => {
    requestControllerRef.current?.abort();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);


    if (activeTab === "text" && text.trim().length < MIN_TEXT_LENGTH) {
      setError({
        title: "Job details are missing",
        message: `Enter at least ${MIN_TEXT_LENGTH} characters of job text.`,
        hint: "Paste the job description or recruiter message, not just a link.",
        retryable: false,
      });
      return;
    }

    if (activeTab === "text" && text.length > MAX_TEXT_LENGTH) {
      setError({
        title: "Job details are too long",
        message: `The maximum length is ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
        hint: "Remove extra text, then submit the scan again.",
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
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      let res;
      if (activeTab === "image" && imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        res = await api.post("/analyze/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          signal: controller.signal,
        });
      } else {
        res = await api.post("/analyze/", { text }, { signal: controller.signal });
      }
      navigate("/result", { state: { report: res.data.data } });
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;
      setError(getAnalysisError(err));
    } finally {
      requestControllerRef.current = null;
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20" onPaste={handlePaste}>
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
            Paste job text or upload a screenshot. Our AI reviews the submitted content for common scam indicators; it does not verify employer records.
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
                AI via <strong className="font-semibold text-[#1ecfc1]">GROQ</strong>
              </span>
            </div>

            {/* Input Mode Tabs */}
            <div role="group" aria-label="Select job input type" className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("text");
                  setError(null);
                }}
                aria-pressed={activeTab === "text"}
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
                aria-pressed={activeTab === "image"}
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
                    {text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} characters
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="job-text"
                    rows={6}
                    maxLength={MAX_TEXT_LENGTH}
                    placeholder="Paste a job description, recruiter email, or WhatsApp/Telegram message here..."
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
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-400 group-hover:border-[#1ecfc1]/40 group-hover:text-[#1ecfc1] group-hover:scale-105 transition-all mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-200">
                      Click to upload or drop a screenshot
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Supports PNG, JPG up to 5MB
                    </p>
                    <p className="mt-2 text-xs text-[#1ecfc1]/80">
                      Or paste an image from your clipboard
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
              <div role="status" aria-live="polite" className="my-6 rounded-2xl border border-[#1ecfc1]/30 bg-[#1ecfc1]/5 p-5 text-center">
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
                  Reviewing submitted content. This can take up to a minute.
                </p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full w-1/3 bg-[#1ecfc1]"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/10 pt-6">

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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
                {loading && (
                  <Button type="button" variant="outline" onClick={handleCancelScan} className="w-full sm:w-auto border-white/15 text-gray-300">
                    Cancel scan
                  </Button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default Test;
