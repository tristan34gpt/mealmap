function SkeletonMeals() {
  return (
    <div className="p-5 ">
      <div className=" flex justify-center items-center">
        {/* Title */}
        <div className="animate-pulse md:w-[300px] md:h-[30px] w-[200px] h-[20px] bg-gray-300 rounded-lg mb-5  "></div>
      </div>
      {/* Skeleton for "Repas" section */}
      <div className="flex justify-center items-center">
        <div className="animate-pulse md:w-[500px] w-[100px] md:h-[250px] h-[100px] bg-gray-300 rounded-lg md:mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5 hidden md:block"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg hidden md:block"></div>
      </div>

      <div className="w-full border-gray-300 border my-5 animate-pulse"></div>
      {/* Skeleton for "Desserts" section */}
      <div className="flex justify-center items-center mt-5">
        <div className="animate-pulse  md:w-[500px] w-[100px] md:h-[250px] h-[100px] bg-gray-300 rounded-lg md:mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5 hidden md:block"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg hidden md:block"></div>
      </div>
      <div className="w-full border-gray-300 border my-5 animate-pulse"></div>
      {/* Skeleton for "Pic nique" section */}
      <div className="flex justify-center items-center mt-5">
        <div className="animate-pulse  md:w-[500px] w-[100px] md:h-[250px] h-[100px] bg-gray-300 rounded-lg md:mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg hidden md:mr-5 md:block"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg hidden md:block"></div>
      </div>
    </div>
  );
}

export default SkeletonMeals;
