import { useState } from "react";

const slider = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <button>Nex</button>
      {items.map((item, index) => (
        <div key={index}>
          <img src="" alt="image du repas" />
        </div>
      ))}
      <button>Prec</button>
    </div>
  );
};
export default slider;
