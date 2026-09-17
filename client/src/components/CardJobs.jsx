import { Check } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

function CardJobs({ job }) {
  return (
    <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20 px-4 py-4 hover:scale-105 transition-all cursor-pointer border ">
      <div className="flex gap-2 items-center">
        <img
          className="rounded-full h-10 w-10 object-cover"
          src={job.imageUrl}
          alt="company"
        />
        <p className="font-semibold mr-1 ">{job.company}</p>
        <div className="flex gap-1.5 items-center text-zinc-600">
          <div className="flex gap-1 items-center">
            <p className="hidden text-sm sm:flex">Verified Company</p>
            <Check className="hidden w-4 h-4 sm:flex" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-lg leading-8">
        <div className="flex font-semibold ">{job.title}</div>
        <p>{job.desc}</p>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <p className="font-semibold hidden sm:flex">Job Type : </p>
            {job.jobType}
          </div>
          <div className=" ">
            <span className="h-fit md:mr-2 whitespace-nowrap inline-block">Prerequisites :</span> 
            <div className="flex  gap-2 flex-wrap">
              {job.prerequisites.map((preq,idx)=>(
              <Button className="pointer-events-none bg-white text-gray-900 " key={preq}>{preq}</Button>
            ))}
            </div>
          </div>
          <div className="flex gap-1.5">
            <p className="font-semibold hidden sm:flex">Salary : </p>
            {job.salary}$ per Month
          </div>
        </div>
        <Button className="bg-[#1ecfc1] text-gray-900 cursor-pointer hover:opacity-90 transition-all w-24">
          Apply Now
        </Button>
      </div>
    </div>
  );
}

export default CardJobs;