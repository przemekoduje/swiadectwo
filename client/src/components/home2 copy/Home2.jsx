import React, { useEffect, useRef } from "react";
import "./home2.scss";
// import Comix from "../comix/Comix";

// const images = [
//   "/images/Tło usunięte (scene1).png",
//   "/images/Tło usunięte (scene2).png",
//   "/images/Tło usunięte (scene3).png",
//   "/images/Tło usunięte (scene4).png",
//   "/images/Tło usunięte (scene5).png",
//   "/images/Tło usunięte (scene6).png",
// ];

// const head = [
//   "Czy Twój dom jest energooszczędny? ",
//   "Pierwszy krok do oszczędności.",
//   "Zoptymalizuj swój dom.",
//   "Komfort i oszczędność.",
//   "Świadectwo to krok ku lepszemu środowisku.",
//   "Świadectwo to inwestycja w naturę.",
// ];

// const opis = [
//   "Świadectwo charakterystyki energetycznej pomaga odpowiedzieć na to pytanie.",
//   "Z pomocą specjalisty możesz dowiedzieć się, jak poprawić efektywność energetyczną swojego domu.",
//   "Świadectwo energetyczne wskazuje, gdzie Twój dom może zaoszczędzić energię – od izolacji po lepsze okna.",
//   "Lepsza efektywność energetyczna to niższe rachunki, większy komfort życia i przyjazność dla natury.",
//   "Dzięki świadectwom energetycznym zmniejszamy nasz ślad węglowy i dbamy o przyszłość planety.",
//   "Z każdym świadectwem sadzimy drzewa, wspólnie tworząc zdrowszą przyszłość dla nas wszystkich.",
// ];

export default function Home2() {
//   const comixContainerRef = useRef(null);

//   useEffect(() => {
//     const comixItems = comixContainerRef.current.children;

//     const handleIntersection = (entries) => {
//       entries.forEach((entry) => {
//         const index = Array.from(comixItems).indexOf(entry.target);
//         const delay = index * 0.2; // Każdy element ma swoje opóźnienie w animacji

//         if (entry.isIntersecting) {
//           entry.target.style.transitionDelay = `${delay}s`;
//           entry.target.style.transform = "translateY(0px)";
//           entry.target.style.opacity = "1";
//         } else {
//           entry.target.style.transitionDelay = "0s";
//           entry.target.style.transform = "translateY(200px)";
//           entry.target.style.opacity = "0";
//         }
//       });
//     };

//     const observer = new IntersectionObserver(handleIntersection, {
//       threshold: 0.5,
//     });

//     Array.from(comixItems).forEach((item) => {
//       observer.observe(item);
//     });

//     return () => {
//       Array.from(comixItems).forEach((item) => {
//         observer.unobserve(item);
//       });
//     };
//   }, []);

  return (
    <div className="home2-container">
       <h1>Home2</h1> 
      {/* <div className="display">
        <h1>Na co komu ten cały kłopot?</h1>
      </div>

      <span className="info_h2 lato-regular">
        Świadectwo charakterystyki energetycznej to nie zbędna formalność, ale
        klucz do oszczędności i wyższej wartości Twojej nieruchomości. Dzięki
        niemu wiesz, gdzie Twój dom traci energię i jakie kroki podjąć, by to
        zmienić – od poprawy izolacji po wymianę okien. Lepsza efektywność
        energetyczna to nie tylko niższe rachunki, ale i wyższa wartość
        rynkowa budynku. Inwestycja w świadectwo to pierwszy krok do poprawy
        komfortu życia, zwiększenia atrakcyjności nieruchomości na rynku oraz
        wsparcia dla środowiska, bo każdy z nas może działać na rzecz redukcji
        emisji CO₂.
      </span>

      <div ref={comixContainerRef} className="images-cont_h2">
        {images.map((img, index) => (
          <div className="comix-item" key={index}>
            <Comix image={img} head={head[index]} opis={opis[index]} />
          </div>
        ))}
      </div> */}
    </div>
  );
}
