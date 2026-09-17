import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { motion } from "framer-motion";

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
    if (password !== confirmPassword) {
      setError("Password tidak sama.");
      return;
    }
    setLoading(true);
    try {
      await register(email, username, password);
      navigate("/test");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-24 h-full mx-auto w-full max-w-screen-xl px-4 md:px-20 flex">
      <div className="flex flex-col w-full justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2 } }}
          className="px-2"
        >
          <h2 className="mt-2 tracking-tight text-center text-balance font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white flex flex-col gap-2 mb-4">
            Join the Fight
          </h2>
          <h2 className="mt-2 tracking-tight text-center text-balance font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 bg-[#1ecfc1] flex flex-col gap-2 mb-12 sm:mb-20 px-2">
            Create your account.
          </h2>
        </motion.div>
        <motion.form
          className="w-full flex flex-col max-w-[600px] justify-center items-center px-4 sm:px-10 border rounded-lg pb-10 sm:pb-14 pt-10 sm:pt-14 gap-8 sm:gap-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2 } }}
          onSubmit={handleSubmit}
        >
          <h1 className="tracking-tight text-center text-balance font-bold text-2xl sm:text-3xl md:text-4xl text-white">
            Register
          </h1>
          {error && (
            <div className="w-full rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}
          <FieldGroup className="flex flex-col gap-6 sm:gap-8 w-full">
            <FieldGroup>
              <FieldLabel className="text-md" htmlFor="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="px-4 py-5 md:text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel className="text-md" htmlFor="username">
                Username
              </FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="john_doe"
                className="px-4 py-5 md:text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel className="text-md" htmlFor="password">
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="px-4 py-5 md:text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel className="text-md" htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="px-4 py-5 md:text-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FieldGroup>
            <Button
              type="submit"
              disabled={loading}
              className="mx-auto mt-4 bg-[#1ecfc1] text-gray-900 cursor-pointer hover:opacity-90 px-8 py-4 text-md md:text-lg"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1ecfc1] hover:underline">
                Login
              </Link>
            </p>
          </FieldGroup>
        </motion.form>
      </div>
    </section>
  );
}

export default Register;
