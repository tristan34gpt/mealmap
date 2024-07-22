import React from "react";

function ModalMealInfos({ isOpen, onClose, meal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <button
          className="text-white rounded-lg p-1 text-[14px] w-[80px] float-right bg-primary-700 hover:bg-red-500"
          onClick={onClose}
        >
          Fermer
        </button>
        <h2 className="text-2xl font-semibold mb-4">{meal.name}</h2>
        <img
          src={meal.img}
          alt={meal.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="mb-2">
          <strong>Ingrédients:</strong>
        </p>
        <ul className="list-disc list-inside mb-4">
          {meal.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <div className="border-b-[1px] m-2 "></div>
        <p>
          <strong>Calories:</strong> {meal.calories}
        </p>
      </div>
    </div>
  );
}

export default ModalMealInfos;
