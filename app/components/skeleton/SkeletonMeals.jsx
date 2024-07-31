function SkeletonMeals() {
  return (
    <div className="p-5">
      <div className="">
        {/* Title */}
        <div className="animate-pulse w-[300px] h-[30px] bg-gray-300 rounded-lg mb-5 mx-auto"></div>

        {/* Skeleton for "Repas" section */}
        <div className="flex justify-center items-center">
          <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5"></div>
          <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5"></div>
          <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      {/* Skeleton for "Desserts" section */}
      <div className="flex justify-center items-center mt-5">
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg"></div>
      </div>

      {/* Skeleton for "Pic nique" section */}
      <div className="flex justify-center items-center mt-5">
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg mr-5"></div>
        <div className="animate-pulse w-[500px] h-[250px] bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}

export default SkeletonMeals;
