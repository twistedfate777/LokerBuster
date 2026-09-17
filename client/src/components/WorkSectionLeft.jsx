import React, { useState } from "react";
import { motion } from "framer-motion";
import ScaleArchitectureDiagram from "./ScaleArchitectureDiagram";
import { works } from "@/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ScaleDiagramSolo from "./ScaleDiagramSolo";
import { ArrowRight } from "lucide-react";

function WorkSectionLeft() {
  const [hoverObject, setHoverObject] = useState(null);
  return (
    <>
      <motion.div
        className="flex py-10 mb-12 sm:mb-20 lg:hidden"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: { duration: 1.5 },
        }}
        viewport={{ once: true, margin: "-200px" }}
      >
        <Carousel className="w-full">
          <CarouselContent className="flex items-center">
            <CarouselItem className="w-screen flex flex-col">
              <ScaleArchitectureDiagram hoverObject={hoverObject} />
              <div className="flex flex-col items-center justify-center">
                <h1 className="flex gap-4 items-center text-lg sm:text-xl">
                  Swipe to check out
                  <ArrowRight className="font-semibold w-5 h-5" />
                </h1>
              </div>
            </CarouselItem>

            {works.map((work) => (
              <CarouselItem
                className="w-screen flex flex-col"
                key={work.title}
              >
                <ScaleDiagramSolo type={work.hover} />
                <div className="px-6 sm:px-10 flex flex-col gap-3">
                  <div className="flex flex-col">
                    <h1 className="text-[#1ecfc1] text-lg sm:text-xl text-center">
                      {work.title}
                    </h1>
                  </div>
                  <div className="flex justify-center">
                    <p className="max-w-[350px] text-center text-sm sm:text-base">
                      {work.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.div>
      <motion.div className="px-6 sm:px-10 flex flex-col md:flex-row gap-5 py-20 lg:py-30 hidden lg:flex">
        <motion.div
          className="flex flex-col col-span-2 px-6 md:px-20 lg:px-0 z-10 mb-8 lg:mb-0 text-center lg:text-left"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: { duration: 1.5 },
          }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <div className="h-full flex flex-col gap-0">
            {works.map((work) => (
              <div
                className={`flex flex-col gap-4 cursor-pointer py-5 transition-opacity ${hoverObject != null && hoverObject !== work.hover ? "opacity-60" : ""}`}
                onMouseEnter={() => setHoverObject(work.hover)}
                onMouseLeave={() => setHoverObject(null)}
                key={work.title}
              >
                <div className="flex flex-col">
                  <h1 className="text-[#1ecfc1] text-xl">{work.title}</h1>
                </div>
                <div className="w-[90%] font-light">
                  <p>{work.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="hidden lg:flex w-full"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: { duration: 1.5 },
          }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <ScaleArchitectureDiagram hoverObject={hoverObject} />
        </motion.div>
      </motion.div>
    </>
  );
}

export default WorkSectionLeft;
