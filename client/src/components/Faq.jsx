import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants";
import { HelpCircle, Search } from "lucide-react";

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 sm:py-24 border-t border-white/5 relative">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1ecfc1]/10 border border-[#1ecfc1]/30 text-[#1ecfc1] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Pertanyaan yang Sering <span className="text-[#1ecfc1]">Ditanyakan</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-2">
            Punya keraguan atau ingin tahu cara kerja proteksi AI LokerBuster? Temukan jawabannya di bawah ini.
          </p>

          {/* Quick Search Input (Heuristic #7: Flexibility and efficiency of use) */}
          <div className="relative w-full max-w-md mt-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan seputar deteksi loker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#1ecfc1]"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cyber-glass rounded-2xl p-4 sm:p-6 border border-white/10"
        >
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border border-white/5 bg-slate-950/40 rounded-xl px-4 py-1 data-[state=open]:border-[#1ecfc1]/40 data-[state=open]:bg-slate-900/60 transition-colors"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-200 hover:text-[#1ecfc1] text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-1 pb-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
