import React from "react";
import "./home3.scss";

const images = ["/images/flat.png", "/images/dom.png", "/images/building.png"];
const types = ["Mieszkanie", "Dom i Lokal", "Wielorodzinny"];
const prices = ["219 zł", "319 zł", "419 zł"];

// Komponent comixOffer
const ComixOffer = ({ image, type, price }) => {
  return (
    <div className="wrapper">
      <img src={image} alt={type} />
      <div className="type lato-regular">{type}</div>
      <button className="lato-regular">Zamów</button>
      <span className="price lato-regular">{price}</span>
    </div>
  );
};

export default function Home3() {
  return (
    <div className="home3-container">
      <div className="h3-wrapper">
        <h3 className="lato-regular">Twoje świadectwo w 3 klikach:</h3>
        <ul className="lato-regular">
          <li>
            <p>Wybierz typ nieruchomosci i wypełnij odpowiedni formularz</p>
          </li>
          <li>
            <p>
              Audytor dokonuje weryfikacji. Czasami kontaltuje sie telefonicznie
            </p>
          </li>
          <li>
            <p>Odbierasz świadectwo w formie elektronicznej i/lub papierowej</p>
          </li>
        </ul>

        <div className="comix-offer">
          {/* Renderowanie trzech ofert comixOffer */}
          {images.map((image, index) => (
            <ComixOffer
              key={index}
              image={image}
              type={types[index]}
              price={prices[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
