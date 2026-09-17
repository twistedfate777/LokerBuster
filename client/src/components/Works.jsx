import React from "react";
import { works } from "@/constants";
import { motion } from "framer-motion";
import WorkSectionLeft from "./WorkSectionLeft";

function Works() {
  return (
    <section className="overflow-x-hidden pt-12 sm:pt-20">
      <div className="w-full flex justify-center px-4">
        <motion.h1
          className="max-w-[800px] flex items-center text-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-5 md:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1 },
          }}
          viewport={{ once: true, margin: "-200px" }}
        >
          CORE FUNCTIONS AND COMPONENTS
        </motion.h1>
      </div>
      <WorkSectionLeft />
    </section>
  );
}

export default Works;
