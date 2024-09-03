import React, { useState } from "react";
import { Timer } from "lucide-react";
import { useSession } from "next-auth/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-day-picker/dist/style.css";

import Loader from "./Loader";

function ModalMealDashboard({ isOpen, onClose, meal }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [number, setNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log(meal);

  const { data: session } = useSession(); // Obtenez la session
  console.log(meal);
  if (!isOpen) return null;
  const handleSaveMeal = async () => {
    setLoading(true);
    if (meal && selectedDate) {
      try {
        const userId = session?.user?.id; // Assurez-vous que l'utilisateur est authentifié et que l'ID est disponible

        if (!userId) {
          alert("User not authenticated");
          setLoading(false);
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
          setLoading(false);
          onClose();
        } else {
          alert("Failed to plan meal.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error planning meal:", error);
        setLoading(false);
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
          className={` ${
            loading
              ? "text-white rounded-lg p-1 text-[14px] w-[80px] float-right bg-primary-700 opacity-50 cursor-not-allowed"
              : "text-white rounded-lg p-1 text-[14px] w-[80px] float-right bg-primary-700 hover:bg-red-500 "
          } `}
          onClick={onClose}
          disabled={loading}
        >
          Fermer
        </button>

        <h2 className="text-2xl font-semibold mb-4">{meal.mealName}</h2>
        <img
          src={meal.mealImage}
          alt={meal.mealName}
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
            Pour {meal.number} personne
          </label>
        </div>
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          className="w-full"
          pagination={{ clickable: true }}
        >
          <SwiperSlide className="flex justify-center items-center">
            <div className="w-full h-[200px] flex flex-col justify-center items-center">
              <p className="mb-2">
                <strong>Ingrédients</strong>
              </p>
              <ul className="flex justify-center items-center flex-col">
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
      </div>
    </div>
  );
}

export default ModalMealDashboard;
