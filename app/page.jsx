"use client";
import React, { useState } from "react";
// import Confetti from "react-confetti-boom";

function page() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleExplosion = () => {
    setShowConfetti(true);
  };

  return (
    <div>
      {/* <button onClick={handleExplosion}>
        Déclencher l'explosion de confettis
      </button>
      {showConfetti && (
        <Confetti
          x={0.5}
          y={0.1}
          particleCount={50}
          deg={270}
          shapeSize={8}
          spreadDeg={45}
          effectInterval={2000}
          effectCount={3}
          colors={["#ff577f", "#ff884b", "#ffd384", "#fff9b0", "#3498db"]}
        />
      )} */}
    </div>
  );
}

export default page;
