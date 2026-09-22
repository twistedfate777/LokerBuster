import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { faqData } from "@/constants";
import { HelpCircle, ShieldCheck } from "lucide-react";

function Faq() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-gray-300 backdrop-blur-sm"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#1ecfc1]" />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Everything you need to know about scam defense
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-pretty text-sm sm:text-base text-gray-400"
          >
            How our AI models evaluate risk, score offers, and safeguard your career credentials.
          </motion.p>
        </div>

        {/* Accordion Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((faq, index) => (
              <AccordionItem
                value={`item-${faq.id}`}
                key={`item-${faq.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/70 px-5 py-1 backdrop-blur-md transition-all hover:border-[#1ecfc1]/30 hover:bg-[#0f172a]/90 data-[state=open]:border-[#1ecfc1]/50 data-[state=open]:bg-gradient-to-b data-[state=open]:from-[#0f172a] data-[state=open]:to-[#090d18]"
              >
                <AccordionTrigger className="text-left font-medium text-sm sm:text-base text-gray-200 group-hover:text-white hover:no-underline py-4">
                  <div className="flex items-center gap-3 pr-2">
                    <span className="font-mono text-xs text-[#1ecfc1] opacity-70">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-left text-sm sm:text-base leading-relaxed text-gray-400 pb-5 pt-1 pl-7">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export default Faq;
