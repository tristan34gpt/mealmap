"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import {
  format,
  eachDayOfInterval,
  isWithinInterval,
  isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale";

import Meal from "@/app/components/Meal";
import SkeltonDashboard from "@/app/components/skeleton/SkeltonDashboard";

import "react-day-picker/dist/style.css";
import ModalMealDashboard from "@/app/components/ModalMealDashboard";

function Dashboard() {
  // Variables
  const { data: session, status } = useSession();

  const [range, setRange] = useState({ from: null, to: null });
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [macronutrientsTotal, setMacronutrientsTotal] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [aggregatedIngredients, setAggregatedIngredients] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [targetMeal, setTargetMeal] = useState([]);

  const selectedDates =
    range.from && range.to
      ? eachDayOfInterval({ start: range.from, end: range.to })
      : range.from
      ? [range.from]
      : [];

  // Functions

  const isDateInRange = (date, range) => {
    if (!range.from) {
      return false;
    }
    if (isSameDay(range.from, range.to) || !range.to) {
      return isSameDay(date, range.from); // Si une seule date est sélectionnée, vérifier l'égalité
    }
    return isWithinInterval(date, { start: range.from, end: range.to });
  };

  const handleModal = () => {
    setSelectedMeal(!selectedMeal);
  };

  const handleDateChange = (range) => {
    console.log("handleDateChange called with range:", range);
    console.log("plannedMeals state:", plannedMeals);

    if (range.from && plannedMeals.length > 0) {
      const uniqueMeals = new Map();
      const totalMacronutrients = {
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
      };
      const ingredientMap = {};

      plannedMeals.forEach((meal) => {
        const plannedDate = new Date(meal.plannedDate);

        if (isDateInRange(plannedDate, range)) {
          if (uniqueMeals.has(meal.mealId)) {
            // Aggregating macronutrients if a meal is repeated
            const existingMeal = uniqueMeals.get(meal.mealId);
            existingMeal.macronutrients.protein += meal.macronutrients.protein;
            existingMeal.macronutrients.carbs += meal.macronutrients.carbs;
            existingMeal.macronutrients.fats += meal.macronutrients.fats;
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

      setFilteredMeals(Array.from(uniqueMeals.values()));
      setMacronutrientsTotal(totalMacronutrients);
      setAggregatedIngredients(Object.values(ingredientMap));
    } else {
      console.log("Condition not met. Resetting filteredMeals to empty.");
      setFilteredMeals([]);
      setMacronutrientsTotal({ protein: 0, carbs: 0, fats: 0, calories: 0 });
      setAggregatedIngredients([]);
    }

    setRange(range);
  };

  const aggregateIngredients = (plannedMeals) => {
    const ingredientMap = {};

    plannedMeals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const key = `${ingredient.name}-${ingredient.unit}`;
        if (ingredientMap[key]) {
          ingredientMap[key].quantity += ingredient.quantity;
        } else {
          ingredientMap[key] = { ...ingredient };
        }
      });
    });

    return Object.values(ingredientMap);
  };

  // Cycles
  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true); // Indiquer que le chargement commence
      fetch("/api/meal/fetchPlannedMeal")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data);
          // Supposons que data est un objet avec la clé 'plannedMeals' qui contient le tableau des repas
          if (data && Array.isArray(data.plannedMeals)) {
            setPlannedMeals(data.plannedMeals);
          } else {
            console.error("Unexpected response structure:", data);
          }
          setLoading(false); // Définir setLoading(false) ici
        })
        .catch((error) => {
          console.error("Error fetching planned meals:", error);
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    console.log("plannedMeals updated:", plannedMeals);
  }, [plannedMeals]);

  useEffect(() => {
    console.log(filteredMeals);
  }, [filteredMeals]);

  if (loading) {
    return <SkeltonDashboard />;
  }

  return (
    <div className="p-5">
      <div className="flex justify-between p-5">
        {/* Info purchase */}
        <div>
          <h1 className="font-semibold mb-5">Vos courses</h1>
          {aggregatedIngredients.length > 0 ? (
            aggregatedIngredients.map((ingredient, index) => (
              <div key={index} className="my-2">
                <p>{` ${ingredient.quantity} ${ingredient.name} (${ingredient.unit})`}</p>
              </div>
            ))
          ) : (
            <p>Pas d'ingrédients pour les dates sélectionnées.</p>
          )}
        </div>
        <div>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleDateChange}
            locale={fr}
            className="rounded-md border p-5"
          />
        </div>
      </div>
      {/* Info meal */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          {selectedDates.length > 0 ? (
            <>
              <div className="flex">
                <p>
                  Du {format(selectedDates[0], "PPP", { locale: fr })} au{" "}
                  {format(selectedDates[selectedDates.length - 1], "PPP", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div className="flex">
                {filteredMeals.length > 0 ? (
                  filteredMeals.map((meal, index) => (
                    <div
                      className="cursor-pointer"
                      key={index}
                      onClick={() => {
                        setTargetMeal(meal);
                        console.log(meal);
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
                  ))
                ) : (
                  <h2>Pas de repas pour ces jours sélectionnés</h2>
                )}
              </div>
            </>
          ) : (
            <h2>Sélectionnez des dates pour voir vos repas</h2>
          )}
        </div>
        {selectedDates.length > 0 && (
          <div className="m-5 text-center border-l-[2px] p-5">
            <h3 className="font-semibold mb-2">Info nutriments</h3>
            <ul>
              <li>Protéines : {macronutrientsTotal.protein}g</li>
              <li>Lipides : {macronutrientsTotal.fats}g</li>
              <li>Glucides : {macronutrientsTotal.carbs}g</li>
              <li>Calories : {macronutrientsTotal.calories}</li>
            </ul>
          </div>
        )}
      </div>
      {selectedMeal &&
        filteredMeals.length > 0 &&
        filteredMeals.map((meal, index) => (
          <ModalMealDashboard
            isOpen={Boolean(selectedMeal)}
            onClose={handleModal}
            meal={targetMeal}
            key={index}
          />
        ))}
    </div>
  );
}

export default Dashboard;
