"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import { da, fr } from "date-fns/locale";

import Meal from "@/app/components/Meal";
import SkeltonDashboard from "@/app/components/skeleton/SkeltonDashboard";

import "react-day-picker/dist/style.css";
import ModalMealDashboard from "@/app/components/ModalMealDashboard";
import Input from "@/app/components/Input";
import { Calendar } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import InfosShopping from "@/app/components/shoppingList/InfosShopping";
import InfosShoppingFinished from "@/app/components/shoppingList/InfosShoppingFinished";

function Dashboard() {
  // Variables
  const { data: session, status } = useSession();

  const [plannedMeals, setPlannedMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [buttonInfosShopping, setButtonInfoShopping] = useState(false);
  const [finishedPurchase, setFinishedPurchase] = useState([]);
  const [ingrediantFinishedn, setIngrediantFinished] = useState([]);
  const [revalide, setRevalide] = useState(false);
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const [macronutrientsTotal, setMacronutrientsTotal] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });

  const [loading, setLoading] = useState(true);
  const [aggregatedIngredients, setAggregatedIngredients] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [targetMeal, setTargetMeal] = useState(null);

  // Helper function to check if two dates are the same
  const isSameDate = (date1, date2) => {
    console.log("verif date", date1, date2);
    return isSameDay(date1, date2);
  };

  // Function to toggle the meal modal
  const handleModal = () => {
    setSelectedMeal(!selectedMeal);
  };

  // Function to handle date change and fetch planned meals
  const handleDateChange = (date) => {
    console.log("date", date);
    if (status === "authenticated") {
      setLoadingMeal(true);
      fetch("/api/meal/fetchPlannedMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id, // Pass the authenticated user's ID
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data.plannedMeals)) {
            // if (isSameDate(purchaseDate, date)) {
            // }
            setPlannedMeals(data.plannedMeals);
            // setFinishedPurchase(data.shoppingFinished);
            console.log("finish", data.shoppingFinished);
            console.log("repas", data.plannedMeals);

            setSelectedDate(date);
            setShowDayPicker(false);

            if (date && data.plannedMeals.length > 0) {
              const uniqueMeals = new Map();
              const totalMacronutrients = {
                protein: 0,
                carbs: 0,
                fats: 0,
                calories: 0,
              };

              const ingredientMap = {};
              const ingredientsFinished = [];
              data.plannedMeals.forEach((meal) => {
                const plannedDate = new Date(meal.plannedDate);

                if (isSameDate(plannedDate, date)) {
                  setPlannedMeals(data.plannedMeals);
                  if (uniqueMeals.has(meal.mealId)) {
                    const existingMeal = uniqueMeals.get(meal.mealId);
                    existingMeal.macronutrients.protein +=
                      meal.macronutrients.protein;
                    existingMeal.macronutrients.carbs +=
                      meal.macronutrients.carbs;
                    existingMeal.macronutrients.fats +=
                      meal.macronutrients.fats;
                    existingMeal.macronutrients.calories +=
                      meal.macronutrients.calories;
                    existingMeal.number += meal.number;
                  } else {
                    uniqueMeals.set(meal.mealId, { ...meal });
                  }

                  meal.ingredients.forEach((ingredient) => {
                    const key = `${ingredient.name}-${ingredient.unit}`;

                    if (ingredientMap[key]) {
                      ingredientMap[key].quantity += ingredient.quantity;
                    } else {
                      ingredientMap[key] = { ...ingredient };
                    }
                  });

                  totalMacronutrients.protein += meal.macronutrients.protein;
                  totalMacronutrients.carbs += meal.macronutrients.carbs;
                  totalMacronutrients.fats += meal.macronutrients.fats;
                  totalMacronutrients.calories += meal.macronutrients.calories;
                }
              });
              const ingrediantFinishMap = [];
              // Adjust ingredient quantities based on finished purchases
              data.shoppingFinished.forEach((purchase) => {
                const purchaseDate = new Date(purchase.date);
                console.log(purchaseDate);
                if (isSameDate(purchaseDate, date)) {
                  console.log("ok");
                  purchase.ingredients.forEach((ingredient) => {
                    console.log(ingredient);
                    const key = `${ingredient.name}-${ingredient.unit}`;
                    if (ingrediantFinishMap[key]) {
                      ingrediantFinishMap[key].quantity += ingredient.quantity;
                    } else {
                      ingrediantFinishMap[key] = { ...ingredient };
                    }

                    ingredientsFinished.push(ingredient);
                    if (ingredientMap[key]) {
                      // Subtract purchased quantity from the planned ingredient quantity
                      ingredientMap[key].quantity -= ingredient.quantity;
                      if (ingredientMap[key].quantity <= 0) {
                        // Remove the ingredient if its quantity drops to zero or below
                        delete ingredientMap[key];
                      }
                    }
                  });
                }
              });
              setFinishedPurchase(ingrediantFinishMap);
              console.log("ook", ingrediantFinishMap);
              setFilteredMeals(Array.from(uniqueMeals.values()));
              setMacronutrientsTotal(totalMacronutrients);
              setAggregatedIngredients(Object.values(ingredientMap));
              setIngrediantFinished(Object.values(ingredientsFinished));
              console.log("idid", ingredientsFinished);
            } else {
              // Reset states when no meals are planned
              setFilteredMeals([]);
              setMacronutrientsTotal({
                protein: 0,
                carbs: 0,
                fats: 0,
                calories: 0,
              });
              setAggregatedIngredients([]);
            }
          } else {
            console.error("Unexpected response structure:", data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching planned meals:", error);
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
    setLoadingMeal(false);
  };

  useEffect(() => {
    if (selectedDate) {
      handleDateChange(selectedDate);
      setDataReady(false);
    }
  }, [revalide]);

  // Function to aggregate ingredients from all planned meals
  // const aggregateIngredients = (plannedMeals) => {
  //   const ingredientMap = {};

  //   plannedMeals.forEach((meal) => {
  //     meal.ingredients.forEach((ingredient) => {
  //       const key = `${ingredient.name}-${ingredient.unit}`;
  //       if (ingredientMap[key]) {
  //         ingredientMap[key].quantity += ingredient.quantity;
  //       } else {
  //         ingredientMap[key] = { ...ingredient };
  //       }
  //     });
  //   });

  //   return Object.values(ingredientMap);
  // };

  // Function to fetch meals for the authenticated user
  const fetchMeal = async () => {
    if (status === "authenticated") {
      fetch("/api/meal/fetchPlannedMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id, // Pass the authenticated user's ID
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data.plannedMeals)) {
            // setPlannedMeals(data.plannedMeals);
            // setFinishedPurchase(data.shoppingFinished);
          } else {
            console.error("Unexpected response structure:", data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching planned meals:", error);
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, [status]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <SkeltonDashboard />;
  }

  const formatDate = () => {
    return selectedDate
      ? `Le ${format(selectedDate, "dd/MM/yyyy", { locale: fr })}`
      : "Sélectionner une date";
  };
  console.log("ingrediantFinishedn:", aggregatedIngredients);

  return (
    <div className="p-5 ">
      <div className="lg:flex lg:flex-row lg:justify-between flex flex-col-reverse p-5 ">
        {/* Shopping info */}
        <div className="lg:h-[500px] lg:w-[500px] w-full  h-[400px] custom-scrollbar overflow-auto p-5">
          <div>
            <button
              className={`font-semibold mb-5 mr-5 text-white py-1 px-3 rounded-lg hover:bg-primary-600 transition-all ${
                buttonInfosShopping ? "bg-primary-500" : "bg-primary-600"
              }`}
              onClick={() => setButtonInfoShopping(false)}
            >
              Vos courses
            </button>
            <button
              className={`font-semibold mb-5 mr-5 text-white hover:bg-primary-600 p-1 rounded-lg py-1 px-3 ${
                buttonInfosShopping ? "bg-primary-600" : " bg-primary-500"
              }`}
              onClick={() => setButtonInfoShopping(true)}
            >
              Achat finis
            </button>
          </div>
          {aggregatedIngredients.length > 0 ||
          ingrediantFinishedn.length > 0 ? (
            !buttonInfosShopping ? (
              aggregatedIngredients.length > 0 ? (
                aggregatedIngredients.map((ingredient, index) => (
                  <div key={index} className="my-2">
                    <InfosShopping
                      ingredient={ingredient}
                      selectedDate={selectedDate}
                      setRevalide={setRevalide}
                      revalide={revalide}
                    />
                  </div>
                ))
              ) : (
                <p>La liste de courses est terminée !</p>
              )
            ) : ingrediantFinishedn.length > 0 ? (
              ingrediantFinishedn.map((purchase, index) => (
                <div key={index} className="my-2">
                  {console.log("iiiii", purchase)}
                  <InfosShoppingFinished
                    ingredients={purchase}
                    id={purchase.id}
                    setRevalide={setRevalide}
                    revalide={revalide}
                    date={selectedDate}
                    func={handleDateChange}
                  />
                </div>
              ))
            ) : (
              <p>Pas d'achats terminés.</p>
            )
          ) : (
            <p>Pas d'ingrédients pour la date sélectionnée.</p>
          )}
        </div>
        {windowWidth > 1023 ? (
          <div>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              locale={fr}
              className="rounded-md border p-5"
            />
          </div>
        ) : (
          <div className="mt-4 md:mb-0 mb-10 ">
            <div className="relative rounded-md">
              <Input
                type="text"
                placeholder="Sélectionnez une date"
                Icon={Calendar}
                label="Sélectionnez une date"
                value={formatDate()}
                onClick={() => setShowDayPicker(true)}
                onChange={() => {}}
                className={"mb-5"}
              />
              {showDayPicker && (
                <div className="absolute mb-2 lg:right-1 p-2 z-5 mt-2 bg-white border border-gray-300 rounded-md shadow-lg lg:w-full w-[300px] overflow-hidden">
                  <DayPicker
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    locale={fr}
                    mode="single"
                    className="p-2 overflow-x-auto"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Meal information */}
      <div>
        <div>
          {selectedDate ? (
            <>
              <div className="flex">
                <p className="">
                  {format(selectedDate, "PPP", { locale: fr })}
                </p>
              </div>
              <div className="flex">
                {filteredMeals.length > 1 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    slidesPerView={2}
                    centeredSlides={true}
                    loop={true} // Enable loop only if there are multiple slides
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                      },
                      1024: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                      },
                    }}
                    className="swiper-container"
                  >
                    {filteredMeals.map((meal, index) => (
                      <SwiperSlide key={index} className="w-[auto] p-[50px]">
                        <div
                          className="cursor-pointer flex justify-center items-center"
                          onClick={() => {
                            setTargetMeal(meal);
                          }}
                        >
                          <Meal
                            img={meal.mealImage}
                            title={meal.mealName}
                            quantity={meal.number}
                            click={() => {
                              handleModal();
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : filteredMeals.length === 1 ? (
                  // Special handling for a single slide
                  <div
                    className="w-[auto] p-[50px] cursor-pointer flex justify-center items-center"
                    onClick={() => {
                      setTargetMeal(filteredMeals[0]);
                    }}
                  >
                    <Meal
                      img={filteredMeals[0].mealImage}
                      title={filteredMeals[0].mealName}
                      quantity={filteredMeals[0].number}
                      click={() => {
                        handleModal();
                      }}
                    />
                  </div>
                ) : (
                  <h2>Pas de repas pour cette date sélectionnée</h2>
                )}
              </div>
            </>
          ) : (
            <h2>Sélectionnez une date pour voir vos repas</h2>
          )}
        </div>
      </div>
      {selectedMeal && targetMeal && (
        <ModalMealDashboard
          isOpen={Boolean(selectedMeal)}
          onClose={handleModal}
          meal={targetMeal}
        />
      )}
    </div>
  );
}

export default Dashboard;
