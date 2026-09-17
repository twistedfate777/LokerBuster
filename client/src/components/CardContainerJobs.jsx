import React from "react";

import { jobs } from "@/constants";
import CardJobs from "./CardJobs";

function CardContainerJobs() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16 gap-6 md:gap-10">
        {jobs.map((job)=>(
          <CardJobs job={job} key={job.desc}/>
        ))}
      </div>
    </div>
  );
}

export default CardContainerJobs;