// Meal.js
import { User } from "lucide-react";

function Meal({ img, title, quantity, click }) {
  return (
    <div
      className="flex flex-col m-5 w-[300px] bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
      onClick={click}
    >
      <div className="relative group">
        <img
          className="rounded-lg w-full h-[250px] object-cover hover:opacity-40"
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
