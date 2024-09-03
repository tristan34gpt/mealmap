function SkeltonDashboard() {
  return (
    <div className="p-5">
      <div className="flex lg:flex-row lg:justify-between flex-col-reverse">
        {/* course */}
        <div className="flex flex-col">
          <div className="flex">
            <div className="animate-pulse w-[100px] mr-5 h-[30px]  bg-gray-300 rounded-lg"></div>
            <div className="animate-pulse w-[100px] h-[30px]  bg-gray-300 rounded-lg"></div>
          </div>
          <div className="animate-pulse w-[300px] mt-5 h-[20px]  bg-gray-300 rounded-lg"></div>
        </div>
        {/* Calendar */}

        <div className="animate-pulse lg:w-[500px] lg:h-[300px] w-[200px] h-[30px] bg-gray-300 rounded-lg lg:mb-0 mb-[50px]"></div>
      </div>
      {/* Infos Meals */}
      <div className="animate-pulse mt-[250px] w-[200px] h-[30px]  bg-gray-300 rounded-lg"></div>
    </div>
  );
}

export default SkeltonDashboard;
