import React, { useState } from "react";
import { motion } from "framer-motion"; // Importujemy motion z framer-motion
import "./home2.scss";

// Karty z obrazami
const cards = [
  { id: 1, imageUrl: "/images/scene1.png", h3: "Czy Twój dom jest energooszczędny?", p: "Świadectwo charakterystyki energetycznej pomaga odpowiedzieć na to pytanie." },
  { id: 2, imageUrl: "/images/scene2.png", h3: "Pierwszy krok do oszczędności.", p: "Z pomocą specjalisty możesz dowiedzieć się, jak poprawić efektywność energetyczną swojego domu." },
  { id: 3, imageUrl: "/images/scene3.png", h3: "Zoptymalizuj swój dom.", p: "Świadectwo energetyczne wskazuje, gdzie Twój dom może zaoszczędzić energię – od izolacji po lepsze okna." },
  { id: 4, imageUrl: "/images/scene4.png", h3: "Komfort i oszczędność.", p: "Lepsza efektywność energetyczna to niższe rachunki, większy komfort życia i przyjazność dla natury." },
  { id: 5, imageUrl: "/images/scene5.png", h3: "Świadectwo to krok ku lepszemu środowisku.", p: "Dzięki świadectwom energetycznym zmniejszamy nasz ślad węglowy i dbamy o przyszłość planety." },
  { id: 6, imageUrl: "/images/scene6.png", h3: "Świadectwo to inwestycja w naturę.", p: "Z każdym świadectwem sadzimy drzewa, wspólnie tworząc zdrowszą przyszłość dla nas wszystkich." },
];

export default function Home2() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zIndexes, setZIndexes] = useState(
    cards.map((_, index) => cards.length - index)
  );

  
  const handleSwipe = (direction) => {
    const newZIndexes = [...zIndexes];

    if (direction === "right") {
      cards.forEach((_, index) => {
        if (index === currentIndex) {
          newZIndexes[index] -= 1; // active card z-index -1
        } else if (index < currentIndex) {
          newZIndexes[index] -= 1; // left z-index -1
        } else {
          newZIndexes[index] += 1; // stack z-index +1
        }
      });
      setCurrentIndex((prevIndex) =>
        prevIndex < cards.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (direction === "left") {
      cards.forEach((_, index) => {
        if (index === currentIndex) {
          newZIndexes[index] -= 1; // active card z-index -1
        } else if (index < currentIndex) {
          newZIndexes[index] += 1; // left z-index +1
        } else {
          newZIndexes[index] -= 1; // stack z-index -1
        }
      });
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }

    setZIndexes(newZIndexes);
  };

  const getCardStyle = (index) => {
    const distance = Math.abs(index - currentIndex);
    const offset = distance * 50; // Stała wartość dla przesunięcia
    const scale = 1 - distance * 0.07; // Stała wartość dla zmniejszania skali

    return {
      zIndex: zIndexes[index],
    };
  };

  // Dodajemy obsługę przeciągania
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 45) {
      handleSwipe("left"); // Swipe w prawo
    } else if (info.offset.x < -45) {
      handleSwipe("right"); // Swipe w lewo
    }
  };

  return (
    <div className="home2-container">
      <h1 className="lato-regular">Na co Ci ten kłopot?</h1>
      <span className="short  lato-regular">Świadectwo energetyczne to klucz do oszczędności i podniesienia wartości nieruchomości. Dzięki niemu wiesz, jak poprawić efektywność energetyczną swojego domu i wspierać ochronę środowiska.</span>
      <div className="card-swipe-container">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`card ${index === currentIndex
              ? "active"
              : index < currentIndex
                ? "left"
                : "card-stack"
              }`}
            style={getCardStyle(index)}

            // Dodajemy animacje
            animate={{
              x: index === currentIndex
                ? 0
                : index < currentIndex
                  ? -35 - (Math.abs(currentIndex - index) * 50) // Przesuwanie na lewo
                  : 35 + (Math.abs(currentIndex - index) * 50), // Przesuwanie na prawo
              scale: index === currentIndex
                ? 1
                : 1 - (Math.abs(currentIndex - index) * 0.07), // Skala
            }}

            // Dodajemy przeciąganie
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} // Ograniczamy przeciąganie w poziomie
            onDragEnd={handleDragEnd} // Obsługa przeciągnięcia karty

            // Definiujemy animację przejścia
            transition={{
              type: "spring", // Zastosowanie sprężyny
              stiffness: 300, // Im wyższa wartość, tym szybciej karta wróci na miejsce
              damping: 30, // Kontroluje "drgania" przy animacji
            }}

            // Obsługa kliknięcia na kartę poniżej
            onClick={() => {
              if (index !== currentIndex) {
                setCurrentIndex(index); // Zmień aktywną kartę na tę klikniętą
                handleSwipe("right")
              }
            }}
          >
            <div className="h2-img">
              <img src={card.imageUrl} alt={`Card ${card.id}`} className="card-img" />
            </div>
            <div className="h2-texts">
              <h3 className="lato-regular">{card.h3}</h3>
              <p className="lato-regular">{card.p}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="controls">
        <button
          onClick={() => handleSwipe("left")}
          style={{
            visibility: currentIndex === 0 ? "hidden" : "visible", // Ukrywamy, ale zachowujemy miejsce
          }}
        >
          &lt;
        </button>
        <button
          onClick={() => handleSwipe("right")}
          style={{
            visibility: currentIndex === cards.length - 1 ? "hidden" : "visible", // Ukrywamy, ale zachowujemy miejsce
          }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
