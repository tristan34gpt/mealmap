"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DayPicker } from "react-day-picker";
import { format, eachDayOfInterval } from "date-fns";
import { metronome } from "ldrs";
import { fr } from "date-fns/locale";

import InputCommand from "@/app/components/InputCommand";
import Meal from "@/app/components/Meal";
import "react-day-picker/dist/style.css";

function Dashboard() {
  //Variables
  const { data: session, status } = useSession();

  const [range, setRange] = useState({ from: null, to: null });
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDates =
    range.from && range.to
      ? eachDayOfInterval({ start: range.from, end: range.to })
      : [];

  // Accès à la première et à la dernière date sélectionnée
  const firstSelectedDate = selectedDates.length > 0 ? selectedDates[0] : null;
  const lastSelectedDate =
    selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;

  //Functions
  const handleDateChange = (range) => {
    setRange(range);
    if (range && plannedMeals) {
      console.log(range);
      console.log(plannedMeals);
    }
  };

  metronome.register();

  //Cycles
  useEffect(() => {
    console.log("Session status:", status);
    if (status === "authenticated") {
      setLoading(true); // Indiquer que le chargement commence
      fetch("/api/meal/fetchPlannedMeal")
        .then((response) => response.json())
        .then((data) => {
          setPlannedMeals(data);
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
    if (plannedMeals.length > 0) {
      console.log("PlannedMeals updated:", plannedMeals);
    }
  }, [plannedMeals]);

  if (loading) {
    return (
      <div>
        <l-metronome size="40" speed="1.6" color="black"></l-metronome>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between p-5">
        {/* Info purchase */}
        <div>
          <h1 className="font-semibold mb-5">Vos courses</h1>
          <InputCommand label={"poulet"} />
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
          {selectedDates.length > 0 && <h3>Dates sélectionnées :</h3>}
          <div className="flex">
            {firstSelectedDate && (
              <p>Du {format(firstSelectedDate, "PPP", { locale: fr })} </p>
            )}
            {lastSelectedDate && (
              <p className="ml-1">
                au {format(lastSelectedDate, "PPP", { locale: fr })}
              </p>
            )}
          </div>
          {selectedDates.length > 0 ? (
            <Meal plannedMeals={plannedMeals} />
          ) : (
            <h2>Sélectionnez des dates pour voir vos repas</h2>
          )}
        </div>
        {selectedDates.length > 0 && (
          <div className="m-5 text-center border-l-[2px] p-5">
            <h3 className="font-semibold mb-2">Info nutriments</h3>
            <ul>
              <li>Protéin : 200gr</li>
              <li>Lipides : 70gr</li>
              <li>Glucide : 150gr</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
