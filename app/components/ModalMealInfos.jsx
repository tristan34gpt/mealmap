import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar, Timer } from "lucide-react";
import { useSession } from "next-auth/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Confetti from "react-confetti-boom";

import Input from "./Input";
import Button from "./Button";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loader from "./Loader";
import "react-day-picker/dist/style.css";

function ModalMealInfos({ isOpen, onClose, meal }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [number, setNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [limit, setLimit] = useState(null);

  const { data: session } = useSession();
  console.log(meal.prepTime);
  if (!isOpen) return null;
  const handleSaveMeal = async () => {
    setLoading(true);

    if (meal && selectedDate) {
      try {
        const userId = session?.user?.id;

        if (!userId) {
          alert("User not authenticated");
          setLoading(false);
          return;
        }

        // Obtenir la date d'aujourd'hui
        const currentDate = new Date();

        const response = await fetch("/api/meal/plannedMeals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
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
            prepTime: meal.prepTime,
            datePlanned: currentDate.toISOString(), // Ajout de la date de planification (aujourd'hui)
          }),
        });

        if (response.ok) {
          setLoading(false);
          setIsExploding(true); // Optionnel pour l'animation de réussite
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

  function getCurrentWeekDates() {
    const today = new Date();

    // Calculez le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
    const dayOfWeek = today.getDay();

    // Si aujourd'hui est dimanche (0), le ramener au dernier jour (7) pour faciliter le calcul
    const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Obtenez la date du lundi (premier jour de la semaine)
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOffset);

    // Créez un tableau contenant toutes les dates de la semaine (lundi à dimanche)
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      weekDates.push(currentDay);
    }

    return weekDates;
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDayPicker(false);
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id, // Pass the authenticated user's ID
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();

        // Vérifiez si la propriété 'subscription' existe et n'est pas vide
        if (data.subscription && data.subscription.length > 0) {
          // Accédez au statut du premier abonnement
          console.log(data.subscription[0].status);
          if (
            data.subscription[0].status !== "ACTIVE" &&
            data.subscription[0].planId !== "66d74381dab92501fb416af9"
          ) {
            console.log(session.user.id);
            const mealResponse = await fetch("/api/meal/fetchPlannedMeal", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: session.user.id, // Pass the authenticated user's ID
              }),
            });

            if (!mealResponse.ok) {
              throw new Error(
                "Meal fetch response was not ok " + mealResponse.statusText
              );
            }

            const mealData = await mealResponse.json();
            console.log(mealData);

            // Obtenez les dates de la semaine actuelle (lundi à dimanche)
            const currentWeekDates = getCurrentWeekDates();

            // Filtrer les repas planifiés qui sont dans cette semaine
            const mealsThisWeek = mealData.plannedMeals.filter((meal) => {
              const mealDate = new Date(meal.datePlanned);
              return currentWeekDates.some(
                (weekDate) =>
                  mealDate.getFullYear() === weekDate.getFullYear() &&
                  mealDate.getMonth() === weekDate.getMonth() &&
                  mealDate.getDate() === weekDate.getDate()
              );
            });

            // Vérifiez si plus de 2 repas sont planifiés cette semaine
            if (mealsThisWeek.length >= 2) {
              console.log(
                "Plus de 2 planifications de repas pour cette semaine."
              );
              setLimit(true);
            } else {
              setLimit(false);
            }
          } else {
            setLimit(false);
          }
        } else {
          console.log("No subscription found.");
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6  overflow-y-auto  custom-scrollbar w-full md:h-[800px] sm:h-[700px] h-[400px] max-w-md mx-4">
        {/* {isExploding && (
          <Confetti
            x={0.5}
            y={0.1}
            particleCount={5}
            deg={20}
            shapeSize={8}
            spreadDeg={5}
            effectInterval={2000}
            effectCount={3}
            colors={["#ff577f", "#ff884b", "#ffd384", "#fff9b0", "#3498db"]}
          />
        )} */}

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
              <div className=" flex flex-col justify-center items-center mb-4 w-full">
                {meal.ingredients.map((ingredient, index) => (
                  <div key={index} className="">
                    {ingredient.name} - {ingredient.quantity * number}
                    {ingredient.unit}
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="flex justify-center items-center w-full ">
            <div className="w-full h-[200px] flex flex-col justify-center items-center">
              <p className="mb-2">
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
              <div className="absolute mb-2 p-2 z-50 bottom-10 bg-white border border-gray-300 rounded-md shadow-lg mb:w-full w-[300px] overflow-hidden">
                <DayPicker
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  locale={fr}
                  mode="single"
                  className="mb:p-2overflow-x-auto"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          {limit == null ? (
            <p className="text-center">Vérification ...</p>
          ) : limit ? (
            <p className="text-center">
              Passer à la version premium pour planifier plus de repas
            </p>
          ) : loading ? (
            <div className="w-full flex justify-center">
              <Loader />
            </div>
          ) : (
            <Button click={handleSaveMeal} className="w-[150px] h-[30px]">
              Enregistrer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalMealInfos;
