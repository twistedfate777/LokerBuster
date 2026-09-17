import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ScanNow() {
  const { user } = useAuth();

  return (
    <section>
      <motion.div
        className="py-16 sm:py-24 h-full mx-auto w-full max-w-screen-xl px-4 md:px-20"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
        viewport={{ once: true, margin: "-200px" }}
      >
        <div className="mb-8 sm:mb-12 px-4 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="order-1 mt-2 tracking-tight text-center text-balance font-bold text-3xl sm:text-5xl md:text-6xl text-white flex flex-col gap-2">
              <span className="relative px-1 rounded bg-[#1ecfc1] text-gray-900 py-2">
                Start scanning
              </span>
              <span>Now!</span>
            </h2>
          </div>
        </div>

        <ul className="mx-auto text-left px-4 sm:px-3 mt-8 sm:mt-12 max-w-prose text-sm sm:text-lg space-y-2 w-fit">
          <li className="flex gap-1.5 items-center text-left w-fit">
            <Check className="h-5 w-5 shrink-0 text-[#1ecfc1]" />
            Instant Scam Scoring based on real-time company history vetting
          </li>
          <li className="flex gap-1.5 items-center text-left w-fit">
            <Check className="h-5 w-5 shrink-0 text-[#1ecfc1]" />
            Advanced shield technology to block fraudulent recruitment networks
          </li>
          <li className="flex gap-1.5 items-center text-left w-fit">
            <Check className="h-5 w-5 shrink-0 text-[#1ecfc1]" />
            Total data privacy to vet your next career move without leaking info
          </li>
          <div className="flex justify-center">
            {user ? (
              <Link to="/test" className="flex justify-center w-full mt-5">
                <Button className="mx-auto mt-4 bg-[#1ecfc1] text-gray-900 cursor-pointer hover:opacity-90 px-5 py-4">
                  Scan now <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="flex justify-center w-full mt-5">
                <Button
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "mx-auto mt-4 bg-[#1ecfc1] text-gray-900 cursor-pointer hover:opacity-90",
                  })}
                >
                  Login to Scan <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </ul>
      </motion.div>
    </section>
  );
}

export default ScanNow;
