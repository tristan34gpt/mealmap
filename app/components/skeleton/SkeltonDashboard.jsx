function SkeltonDashboard() {
  return (
    <div className="p-5">
      <div className="flex justify-between">
        {/* course */}
        <div className="flex flex-col">
          <div className="animate-pulse w-[200px] h-[30px]  bg-gray-300 rounded-lg"></div>
          <div className="animate-pulse w-[100px] mt-5 h-[30px]  bg-gray-300 rounded-lg"></div>
          <div className="animate-pulse w-[100px] mt-5 h-[30px]  bg-gray-300 rounded-lg"></div>
        </div>
        {/* Calendar */}

        <div className="animate-pulse w-[500px] h-[300px]  bg-gray-300 rounded-lg"></div>
      </div>
      {/* Infos Meals */}
      <div className="animate-pulse mt-[100px] w-[200px] h-[30px]  bg-gray-300 rounded-lg"></div>
    </div>
  );
}

export default SkeltonDashboard;
