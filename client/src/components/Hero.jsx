import React from "react";

import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import ShieldContainer from "./ShieldContainer";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="overflow-hidden">
      <div className="overflow-hidden h-full mx-auto w-full max-w-screen-xl px-4 md:px-20 pb-16 pt-6 lg:pt-10 xl:pt-14 lg:grid lg:grid-cols-4 lg:pb-24 relative">
        <div className="col-span-2 px-4 lg:px-0 lg:pt-4 z-10">
          <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="relative w-fit tracking-tight text-balance mt-10 sm:mt-16 font-bold text-white text-3xl sm:text-4xl flex gap-2 items-center flex-wrap justify-center lg:justify-start">
              <h1>Apply with</h1>
              <span className="bg-[#1ecfc1] px-2 text-gray-900">
                Confidence.
              </span>
            </div>
            <div className="mt-6 sm:mt-8 text-base sm:text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap flex flex-col mb-4 md:mb-0 gap-6 lg:gap-4">
              <p className="text-lg sm:text-xl">
                Don't let your career goals lead you into a trap.
              </p>
              <p className="font-semibold">
                LokerBuster uses advanced AI to
                <span className="mx-1.5 bg-[#1ecfc1] font-semibold text-gray-900 px-1.5">
                  Shield
                </span>
                you from ghost companies, fraudulent fees, and
                deceptive recruitment networks in real-time.
              </p>
            </div>
            <ul className="mt-5 space-y-2 text-left flex flex-col items-center sm:items-start">
              <div className="space-y-2">
                <li className="flex gap-1.5 items-center text-left">
                  <p className="font-semibold text-lg">What We Offer</p>
                </li>
                <li className="flex gap-1.5 items-center text-left text-sm sm:text-base">
                  <Check className="h-5 w-5 shrink-0 text-[#1ecfc1]" />
                  Advanced AI that blocks job scams before you hit apply.
                </li>
                <li className="flex gap-1.5 items-center text-left text-sm sm:text-base">
                  <Check className="h-5 w-5 shrink-0 text-[#1ecfc1]" />
                  Automated screening to shield you from "ghost" companies
                </li>
                <li className="flex gap-1.5 items-center text-left text-sm sm:text-base">
                  <Check className="h-5 w-5 shrink-0 text-[#1ecfc1]" />
                  Secure Career Growth
                </li>
              </div>
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start items-center w-full gap-4">
              <Link to={user ? "/test" : "/login"}>
                <Button className="bg-[#1ecfc1] text-gray-900 cursor-pointer transition-all hover:opacity-90 px-6 py-3">
                  Scan This Job
                </Button>
              </Link>
              <Link to={"/jobs"}>
                <Button className="bg-white text-gray-900 cursor-pointer transition-all hover:opacity-90 px-6 py-3">
                  View Verified Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-2 hidden lg:flex h-[400px] xl:h-[500px] w-full absolute top-10 right-0 max-w-[50%]">
          <div className="relative w-full h-full">
            <ShieldContainer />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
