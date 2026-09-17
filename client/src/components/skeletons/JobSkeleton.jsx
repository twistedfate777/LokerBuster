const JobSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-4 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="bg-gray-300 w-10 h-10 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-2">
          <div className="bg-gray-300 h-3 w-20 rounded-full"></div>
        </div>
      </div>
      <div className="bg-gray-300 h-4 w-[40%] mb-4 rounded-full"></div>
      <div className="bg-gray-300 h-5 w-full  rounded-full"></div>
      <div className="bg-gray-300 h-5 w-[70%] mb-4 rounded-full"></div>
      <div className="bg-gray-300 h-4 w-[37%]  rounded-full"></div>
      <div className="bg-gray-300 h-4 w-[60%] mb-4 rounded-full"></div>
      <div className="bg-gray-300  h-[14%] w-18 mb-4 rounded-md"></div>

    </div>
  );
};

export default JobSkeleton;
