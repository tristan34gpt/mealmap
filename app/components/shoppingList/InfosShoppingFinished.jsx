import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

function InfosShoppingFinished({
  ingredients,
  setRevalide,
  revalide,
  id,
  date,
  func,
}) {
  const inputRef = useRef(null);
  const [checked, setChecked] = useState(true);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    console.log("ref", inputRef.current.value);
    if (ingredients && id && session?.user?.id) {
      try {
        const response = await fetch("/api/meal/modifyListShopping", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            id: id,
            date: date,
          }),
        });

        if (response.ok) {
          setLoading(false);
          // Inverser l'état de revalide pour déclencher le useEffect dans le composant parent
          await setRevalide((prevState) => !prevState);
          // await func(date);
        } else {
          console.error("Failed to update shopping list.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error updating shopping list:", error);
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={`p-4 mb-4 bg-white shadow-md rounded-lg ${
        checked ? "opacity-50 line-through" : ""
      } transition-all duration-500`}
    >
      <form>
        <div className="flex items-center">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center">
              <input
                type="hidden"
                ref={inputRef}
                value={`${ingredient.quantity} ${ingredient.name} (${ingredient.unit})`}
              />
              <p className="mr-2 flex-grow text-lg text-gray-800">
                {`${ingredient.quantity} ${ingredient.name} (${ingredient.unit})`}
              </p>
              {loading ? (
                <p>chargement...</p>
              ) : (
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary-600 transition-transform duration-500 transform hover:scale-125"
                  checked={checked}
                  value={true}
                  // onChange={() => setChecked(!checked)}
                  onClick={handleClick}
                  disabled={!checked}
                />
              )}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default InfosShoppingFinished;
