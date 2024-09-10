import React from "react";

function SkeletonProfile() {
  return (
    <div className=" p-5 ">
      <div className=" mt-[50px] flex justify-center items-center">
        {/* Title */}
        <div className="animate-pulse   w-[500px] h-[30px] bg-gray-300 rounded-lg mb-5  "></div>
      </div>
      {/* Skeleton for "Repas" section */}
      <div className=" mt-[30px] flex flex-col gap-4 justify-center items-center">
        <div className="animate-pulse  w-[300px] h-[30px]  bg-gray-300 rounded-lg md:mr-5"></div>
        <div className="animate-pulse  w-[300px] h-[30px]  bg-gray-300 rounded-lg md:mr-5"></div>
        <div className="animate-pulse  w-[300px] h-[30px]  bg-gray-300 rounded-lg md:mr-5"></div>
        <div className=" mt-5 animate-pulse  w-[200px] md:h-[40px]  bg-gray-300 rounded-lg md:mr-5"></div>
      </div>
    </div>
  );
}

export default SkeletonProfile;
