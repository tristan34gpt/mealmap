// Meal.js
function Meal({ img, title }) {
  return (
    <div className="m-5">
      <h2 className="font-semibold ">{title}</h2>
      <img
        className="w-[200px] h-[150px] rounded-lg"
        src={img}
        alt="image du repas"
      />
    </div>
  );
}

export default Meal;
