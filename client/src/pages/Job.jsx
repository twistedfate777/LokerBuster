import React from "react";

import CardContainerJobs from "@/components/CardContainerJobs";

function Job() {
return (
    <section className="pb-24 pt-16 h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
      <div className="mb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center flex flex-col-reverse gap-5  items-center">
          <h2 className="order-1 mt-2 tracking-tight text-center text-balance font-bold text-3xl md:text-5xl lg:text-6xl text-white flex flex-col gap-2">
            <span className="relative px-1 rounded bg-[#1ecfc1] text-gray-900 py-2 ">
              Pure Opportunity
            </span>{" "}
            Zero Deception
          </h2>
          <span className="text-center">
            We've filtered out the noise, the fakes, and the traps. What's left
            are real jobs from companies that actually exist.
          </span>
        </div>
      </div>

      <CardContainerJobs/>
    </section>
  );
}

export default Job;