import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion as Motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const getErrorMessage = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(getErrorMessage).filter(Boolean).join(" ");
  if (value && typeof value === "object") {
    return Object.values(value).map(getErrorMessage).filter(Boolean).join(" ");
  }
  return "";
};

const getRegisterError = (error) => {
  if (!error?.response) {
    return "Cannot connect to server. Please check your network connection.";
  }
  const { status, statusText, data } = error.response;
  if (status === 409) return "Email or username is already in use.";
  if (status === 429) return "Too many attempts. Please try again in a few minutes.";
  if (status >= 500) return "Server error. Please try again shortly.";

  const errorData = data?.error ?? data;
  const message = [
    errorData?.message,
    errorData?.detail,
    errorData?.error_description,
    errorData?.errors,
    errorData?.non_field_errors,
    errorData,
  ]
    .map(getErrorMessage)
    .find(Boolean);

  if (message) return message;
  const statusDescription = statusText ? `: ${statusText}` : "";
  return `Registration failed (HTTP ${status}${statusDescription}). Please verify details and retry.`;
};

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Compute simple password strength score (0 to 3)
  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), username.trim(), password);
      navigate("/test");
    } catch (err) {
      setError(getRegisterError(err));
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
              Create Analyst Account
            </h1>
            <p className="mt-1.5 text-xs text-gray-400">
              Join the community defense network against fraudulent recruiters.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field */}
            <div>
              <label htmlFor="register-email" className="font-mono text-xs text-gray-300 uppercase block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="register-email"
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

            {/* Username Field */}
            <div>
              <label htmlFor="register-username" className="font-mono text-xs text-gray-300 uppercase block mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="register-username"
                  type="text"
                  placeholder="cyber_defender"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#060a14] pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="register-password" className="font-mono text-xs text-gray-300 uppercase block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#060a14] pl-10 pr-10 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength visual */}
              {password && (
                <div className="mt-2 flex items-center gap-1.5">
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? "bg-[#1ecfc1]" : "bg-white/10"}`} />
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? "bg-[#1ecfc1]" : "bg-white/10"}`} />
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? "bg-emerald-400" : "bg-white/10"}`} />
                  <span className="font-mono text-[10px] text-gray-400 ml-1">
                    {passwordStrength === 3 ? "Strong" : passwordStrength === 2 ? "Medium" : "Basic"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="register-confirm-password" className="font-mono text-xs text-gray-300 uppercase block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#060a14] pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-[#1ecfc1]/50 focus:outline-none focus:ring-1 focus:ring-[#1ecfc1]/50 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#1ecfc1] text-gray-950 font-semibold py-5 text-sm hover:bg-[#1ecfc1]/90 shadow-[0_0_20px_-3px_rgba(30,207,193,0.4)] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#1ecfc1] hover:underline">
              Sign in
            </Link>
          </p>
        </Motion.div>
      </div>
    </section>
  );
}

export default Register;
