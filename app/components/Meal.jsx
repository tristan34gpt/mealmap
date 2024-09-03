import { User } from "lucide-react";

function Meal({ img, title, quantity, click }) {
  return (
    <div
      className=" xl:w-[500px] md:w-[300px] w-[200px] flex flex-col m-5  bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
      onClick={click}
    >
      <div className="relative group">
        <img
          className="md:w-full md:h-[250px] h-[200px] object-cover hover:opacity-40"
          src={img}
          alt="image du repas"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-2">
          <User size={30} />
          <span className="font-semibold text-[20px]">× {quantity}</span>
        </div>
      </div>

      <div className="text-center font-semibold p-2">{title}</div>
    </div>
  );
}

export default Meal;
