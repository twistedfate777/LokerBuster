import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { faqData } from "@/constants";

function Faq() {
  return (
    <section>
      <div className="py-16 sm:py-24 h-full mx-auto w-full max-w-screen-xl px-4 md:px-20">
        <div className="mb-8 sm:mb-12 px-4 lg:px-8">
          <div className="flex flex-col-reverse gap-12 sm:gap-14 mx-auto w-full sm:text-center">
            <motion.h2
              className="w-full order-1 mt-2 tracking-tight text-center text-balance font-bold text-3xl sm:text-5xl md:text-6xl text-white flex flex-col lg:flex-row justify-center items-center gap-2 mb-8 lg:mb-16"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: { duration: 1 },
              }}
              viewport={{ once: true, margin: "-200px" }}
            >
              Frequently
              <span className="relative px-1 rounded bg-[#1ecfc1] text-gray-900 py-2">
                Asked
              </span>
              Question
            </motion.h2>
            <motion.div
              className="w-full px-2 sm:px-10 flex justify-center items-center"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: { duration: 1 },
              }}
              viewport={{ once: true, margin: "-200px" }}
            >
              <Accordion
                type="double"
                collapsible
                defaultValue="item-1"
                className="max-w-2xl w-full"
              >
                {faqData.map((faq) => (
                  <AccordionItem
                    value={`item-${faq.id}`}
                    key={`item-${faq.id}`}
                    className="border px-3 sm:px-4 rounded"
                  >
                    <AccordionTrigger className="text-sm sm:text-md lg:text-lg cursor-pointer text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-left px-2 py-2 h-full text-sm sm:text-md lg:text-lg">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
