"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti-boom";

function InfosShopping({
  ingredient,
  selectedDate,
  removeAdd,
  setRevalide,
  revalide,
  func,
}) {
  const [checked, setChecked] = useState(false);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [explosing, setExplosing] = useState(false);
  const inputRef = useRef(null);
  // console.log("ingredianttableua", ingredient, selectedDate);

  const handleClick = async () => {
    setLoading(true);
    setTimeout(() => {
      setExplosing(true);

      // Remettre setExplosing à false après 3 secondes supplémentaires
      setTimeout(() => {
        setExplosing(false);
      }, 1000);
    }, 1);
    console.log("ingrediant", ingredient, selectedDate);
    console.log(inputRef.current.value);
    if (ingredient && selectedDate) {
      try {
        const userId = session?.user?.id; // Assurez-vous que l'utilisateur est authentifié et que l'ID est disponible

        if (!userId) {
          alert("User not authenticated");
          setLoading(false);

          return;
        }

        const response = await fetch("/api/meal/shoppingFinished", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id, // Passez l'ID de l'utilisateur authentifié
            ingredient: ingredient,
            date: selectedDate,
          }),
        });

        if (response.ok) {
          // alert("Meal planned successfully!");
          setRevalide(!revalide);
          setLoading(false);
          removeAdd(true);
        } else {
          // alert("Failed to plan meal.");
          setLoading(false);
          console.log("shoppingFinished error");
        }
      } catch (error) {
        console.error("Error planning meal:", error);
        setLoading(false);
      }
    }
  };

  console.log("ingré", ingredient);

  return (
    <div
      className={`p-4 mb-4 bg-white shadow-md rounded-lg ${
        checked ? "opacity-50 line-through" : ""
      } transition-all duration-500`}
    >
      <div className="flex items-center">
        <p className="mr-2 flex-grow text-lg text-gray-800">{` ${ingredient.quantity} ${ingredient.name} (${ingredient.unit})`}</p>
        <input
          type="hidden"
          ref={inputRef}
          value={`${ingredient.quantity} ${ingredient.name} (${ingredient.unit})`}
        />
        {loading ? (
          <div className="">...</div>
        ) : (
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary-600 transition-transform duration-500 transform hover:scale-125"
            checked={checked}
            onChange={handleClick} // onChange au lieu de onClick
            disabled={checked} // Désactiver si `checked` est true
          />
        )}

        {explosing && (
          <Confetti
            x={0.2}
            y={0.2}
            particleCount={50}
            deg={-90}
            shapeSize={8}
            spreadDeg={20}
            effectInterval={2000}
            effectCount={1}
            mode={"boom"}
            colors={["#ff577f", "#ff884b", "#ffd384", "#fff9b0", "#3498db"]}
          />
        )}
      </div>
    </div>
  );
}

export default InfosShopping;
