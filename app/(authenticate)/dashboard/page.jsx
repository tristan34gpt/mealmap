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
import "react-day-picker/dist/style.css";

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

  const handleDateChange = (range) => {
    console.log("handleDateChange called with range:", range);
    console.log("plannedMeals state:", plannedMeals);

    if (range.from && plannedMeals.length > 0) {
      const filteredMeals = plannedMeals.filter((meal) => {
        const plannedDate = new Date(meal.plannedDate);
        return isDateInRange(plannedDate, range);
      });

      console.log("Filtered meals:", filteredMeals);

      const totalMacronutrients = filteredMeals.reduce(
        (acc, meal) => {
          acc.protein += meal.macronutrients.protein;
          acc.carbs += meal.macronutrients.carbs;
          acc.fats += meal.macronutrients.fats;
          acc.calories += meal.macronutrients.calories;
          return acc;
        },
        { protein: 0, carbs: 0, fats: 0, calories: 0 }
      );

      const ingredients = aggregateIngredients(filteredMeals);

      setFilteredMeals(filteredMeals);
      setMacronutrientsTotal(totalMacronutrients);
      setAggregatedIngredients(ingredients);
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

  if (loading) {
    return <div>Chargement...</div>;
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
              <h3>Dates sélectionnées :</h3>
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
                    <Meal
                      key={index}
                      img={meal.mealImage}
                      title={meal.mealName}
                    />
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
    </div>
  );
}

export default Dashboard;
