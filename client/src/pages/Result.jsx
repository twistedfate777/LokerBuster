import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

function Result() {
  const location = useLocation();
  const report = location.state?.report;

  const [hasEnteredScam, setHasEnteredScam] = useState(false);
  const [hasEnteredConfidence, setHasEnteredConfidence] = useState(false);

  if (!report) return <Navigate to="/test" replace />;

  const {
    scam_score,
    confidence_level,
    reason,
    company_name,
    position,
    is_scam,
    red_flags,
    green_flags,
  } = report;

  const data = [{ value: scam_score }];
  const data2 = [{ value: confidence_level }];

  let scamText = "";
  if (scam_score <= 20) {
    scamText =
      "Looks good! However, it is always a wise practice to independently research the company before signing.";
  } else if (scam_score <= 40) {
    scamText =
      "Fairly safe, though a few details seem slightly off. Review the terms carefully before taking the next step.";
  } else if (scam_score <= 60) {
    scamText =
      "We advise taking a closer look. Make sure to thoroughly verify the recruiter's identity and company details.";
  } else if (scam_score <= 80) {
    scamText =
      "We strongly advise against engaging further. The risks heavily outweigh the potential opportunity.";
  } else {
    scamText =
      "Please step away from this offer. Engaging further could compromise your personal data or finances.";
  }

  let confidenceText = "";
  if (confidence_level <= 20) {
    confidenceText =
      "Low Confidence: Data is limited. We recommend conducting a manual search to supplement this result.";
  } else if (confidence_level <= 40) {
    confidenceText =
      "Developing Confidence: Our initial scan found some indicators, but further evidence would provide a clearer picture.";
  } else if (confidence_level <= 60) {
    confidenceText =
      "Moderate Confidence: Our analysis is based on standard patterns; please use this result as a general guideline.";
  } else if (confidence_level <= 80) {
    confidenceText =
      "High Confidence: Most indicators align with our database of verified job offer characteristics.";
  } else {
    confidenceText =
      "Total Confidence: Our analysis shows strong correlation with verified data points. This assessment is highly reliable.";
  }

  const hasRedFlags = red_flags && red_flags.length > 0;
  const hasGreenFlags = green_flags && green_flags.length > 0;

  return (
    <section className="flex flex-col min-h-screen h-full w-full items-center justify-center py-16 sm:my-24 gap-4 px-4">
      <motion.h2
        className="mt-2 tracking-tight text-center text-balance font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white flex flex-col gap-2 mb-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1.2 } }}
      >
        Your Test Results
      </motion.h2>

      <motion.div
        className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
      >
        {company_name && (
          <p className="text-base sm:text-lg text-muted-foreground text-center">
            Company:{" "}
            <span className="font-semibold text-white">{company_name}</span>
          </p>
        )}
        {position && (
          <p className="text-base sm:text-lg text-muted-foreground text-center">
            Position:{" "}
            <span className="font-semibold text-white">{position}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        className={`mt-2 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${is_scam ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
      >
        {is_scam ? (
          <ShieldAlert className="w-4 h-4" />
        ) : (
          <ShieldCheck className="w-4 h-4" />
        )}
        {is_scam ? "SCAM DETECTED" : "LOOKS SAFE"}
      </motion.div>

      <motion.div
        className="relative w-full max-w-lg h-52 sm:h-64 flex flex-col items-center justify-end overflow-hidden pointer-events-none"
        onViewportEnter={() => setHasEnteredScam(true)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 1.2 } }}
        viewport={{ once: true, margin: "-200px" }}
      >
        {hasEnteredScam && (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="100%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={20}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill="#f01114"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
        <div className="absolute bottom-4 flex flex-col items-center">
          <p className="text-4xl sm:text-5xl font-black text-white">
            {scam_score}
          </p>
          <p className="text-[#f01114] tracking-widest text-xs">SCAM SCORE</p>
        </div>
      </motion.div>
      <div className="px-4 sm:px-10 text-center mt-6 sm:mt-10 text-sm sm:text-base max-w-2xl">
        {scamText}
      </div>

      <motion.div
        className="relative w-full max-w-lg h-52 sm:h-64 flex flex-col items-center justify-end overflow-hidden pointer-events-none"
        onViewportEnter={() => setHasEnteredConfidence(true)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 1.2 } }}
        viewport={{ once: true, margin: "-200px" }}
      >
        {hasEnteredConfidence && (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="100%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={20}
              data={data2}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill="#1ecfc1"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
        <div className="absolute bottom-4 flex flex-col items-center">
          <p className="text-4xl sm:text-5xl font-black text-white">
            {confidence_level}
          </p>
          <p className="text-[#1ecfc1] tracking-widest text-xs">
            CONFIDENCE LEVEL
          </p>
        </div>
      </motion.div>
      <div className="px-4 sm:px-10 text-center mt-6 sm:mt-10 text-sm sm:text-base max-w-2xl">
        {confidenceText}
      </div>

      {(hasRedFlags || hasGreenFlags) && (
        <motion.div
          className="max-w-2xl w-full mx-auto mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.8, duration: 0.8 },
          }}
        >
          {hasRedFlags && (
            <div className="border border-red-500/30 rounded-lg px-5 py-4 bg-red-500/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-sm font-semibold text-red-400 tracking-widest">
                  RED FLAGS
                </p>
              </div>
              <ul className="space-y-2">
                {red_flags.map((flag, i) => (
                  <li
                    key={i}
                    className="text-sm text-red-300/80 flex items-start gap-2"
                  >
                    <span className="text-red-400 mt-1 shrink-0">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasGreenFlags && (
            <div className="border border-emerald-500/30 rounded-lg px-5 py-4 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-400 tracking-widest">
                  GREEN FLAGS
                </p>
              </div>
              <ul className="space-y-2">
                {green_flags.map((flag, i) => (
                  <li
                    key={i}
                    className="text-sm text-emerald-300/80 flex items-start gap-2"
                  >
                    <span className="text-emerald-400 mt-1 shrink-0">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {reason && (
        <motion.div
          className="max-w-2xl w-full mx-auto mt-6 sm:mt-8 px-6 sm:px-8 py-6 border rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 1, duration: 0.8 },
          }}
        >
          <p className="text-sm font-semibold text-[#1ecfc1] mb-2 tracking-widest">
            AI ANALYSIS
          </p>
          <p className="text-sm sm:text-base leading-relaxed">{reason}</p>
        </motion.div>
      )}
    </section>
  );
}

export default Result;
