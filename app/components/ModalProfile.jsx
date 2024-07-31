import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useSession } from "next-auth/react";
import { LockKeyhole, Mail, User } from "lucide-react";

function ModalProfile({ isOpen, onClose }) {
  const { data: session } = useSession();

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
            ingredients: meal.ingredients,
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

  return (
    <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className=" bg-red-500">
          <button
            className="text-white rounded-lg p-1 text-[14px] w-[70px] float-right bg-primary-700 hover:bg-red-500"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        <div className="flex flex-col justify-center items-center w-full mb-5 ">
          <h1 className="font-semibold my-5 text-[18px]">
            Modifier votre profile
          </h1>
          <form className="flex flex-col justify-center items-center" action="">
            <Input
              type="email"
              placeholder="john@gmail.com"
              Icon={Mail}
              label="Mail"
              value={session.user.email}
              disabled={"disabled"}
              className={"mb-5"}
            />
            <Input
              type="password"
              placeholder="*********"
              Icon={LockKeyhole}
              label="Mot de passe"
              disabled={"disabled"}
              className={"mb-5"}
            />
            <Input
              type="text"
              placeholder="John"
              Icon={User}
              label="Prénom"
              value={session.user.firstName}
              disabled={"disabled"}
              className={"mb-5"}
            />
            <Input
              type="text"
              placeholder="Martinez"
              Icon={User}
              label="Nom"
              value={session.user.lastName}
              disabled={"disabled"}
              className={"mb-5"}
            />
            <Button type="submit" className={"w-[150px] h-[30px] my-5 "}>
              Modifer le profil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalProfile;
