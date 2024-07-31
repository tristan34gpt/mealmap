import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import Input from "./Input";
import { Calendar, Timer } from "lucide-react";
import Button from "./Button";
import { useSession } from "next-auth/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function ModalMealInfos({ isOpen, onClose, meal }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [number, setNumber] = useState(1);

  const { data: session } = useSession(); // Obtenez la session
  console.log(meal);
  if (!isOpen) return null;
  const handleSaveMeal = async () => {
    if (meal && selectedDate) {
      try {
        const userId = session?.user?.id; // Assurez-vous que l'utilisateur est authentifié et que l'ID est disponible

        if (!userId) {
          alert("User not authenticated");
          return;
        }

        const response = await fetch("/api/meal/plannedMeals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id, // Passez l'ID de l'utilisateur authentifié
            mealId: meal.id,
            mealName: meal.title,
            mealImage: meal.image,
            plannedDate: selectedDate,
            ingredients: meal.ingredients.map((ingredient) => ({
              name: ingredient.name,
              quantity: ingredient.quantity * number,
              unit: ingredient.unit,
            })),
            number: parseInt(number, 10),
            recipe: meal.recipe,
            description: meal.description,
            macronutrients: meal.macronutrients,
          }),
        });

        if (response.ok) {
          alert("Meal planned successfully!");
          onClose();
        } else {
          alert("Failed to plan meal.");
        }
      } catch (error) {
        console.error("Error planning meal:", error);
      }
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDayPicker(false);
  };

  return (
    <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <button
          className="text-white rounded-lg p-1 text-[14px] w-[80px] float-right bg-primary-700 hover:bg-red-500"
          onClick={onClose}
        >
          Fermer
        </button>
        <h2 className="text-2xl font-semibold mb-4">{meal.title}</h2>
        <img
          src={meal.image}
          alt={meal.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <div className="border-b-[1px]">
          <p className="mb-2">{meal.description}</p>
        </div>
        <div className="flex  items-center mb-2 mt-5">
          <Timer className="w-[15px]" />
          <p className="text-[12px] ml-1">{meal.prepTime}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-[15px] mb-2" htmlFor="number">
            Pour {number} personne
          </label>
          <input
            type="number"
            id="number"
            min="1"
            className={`bg-[#F9FAFB] border-[1px] w-[100px] h-[30px] rounded-[8px] pl-10 pr-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          className="w-full"
        >
          <SwiperSlide className="flex justify-center items-center">
            <div className="w-full h-[200px] flex flex-col justify-center items-center">
              <p className="mb-2">
                <strong>Ingrédients</strong>
              </p>
              <ul className="list-disc list-inside mb-4">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name} - {ingredient.quantity * number}
                    {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>

          <SwiperSlide className="flex justify-center items-center w-full ">
            <div className="w-full h-[200px] flex flex-col justify-center items-center">
              <p>
                <strong>Macronutriments</strong>
              </p>
              <p>Protéines: {meal.macronutrients.protein}g</p>
              <p>Glucides: {meal.macronutrients.carbs}g</p>
              <p>Lipides: {meal.macronutrients.fats}g</p>
              <p>Calories: {meal.macronutrients.calories}</p>
            </div>
          </SwiperSlide>

          <SwiperSlide className="flex justify-center items-center ">
            <div className="w-full h-[200px] flex flex-col justify-center items-center">
              <p className="mb-2">
                <strong>Recette</strong>
              </p>
              <p className="text-center"> {meal.recipe}</p>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="mt-4">
          <div className="relative rounded-md">
            <Input
              type="text"
              placeholder="Sélectionnez une date"
              Icon={Calendar}
              label="Sélectionnez une date"
              value={
                selectedDate ? format(selectedDate, "PPP", { locale: fr }) : ""
              }
              onClick={() => setShowDayPicker(true)}
              onChange={() => {}}
            />
            {showDayPicker && (
              <div className="absolute mb-2 p-2 z-50 bottom-10 bg-white border border-gray-300 rounded-md shadow-lg">
                <DayPicker
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  locale={fr}
                  mode="single"
                  className="p-2"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Button click={handleSaveMeal} className="w-[150px] h-[30px]">
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalMealInfos;
