import React from "react";
import "./home4.scss";

export default function Home4() {
  return (
    <div className="home4">
      <div className="h4-image">
        <img src="/images/mobile11.png" alt="" />
      </div>
      <div className="h4-texts">
        <h3 className="lato-regular">Natychmiastowa pomoc</h3>
        <span className="h4-text_text lato-regular">
          Greenspan, nasz przemiły chatbot odpowie chętnie na większość pytań.
          Bądź proszę wyrozumiały dla ewentualnych pomyłek czy złej składni
          wypowiedzi. Czasami po prostu jest w gorszej kondycji. Uczy się
          dopiero swojego fachu. Jeśli potrzebujesz pomocy audytora, zadzwoń
          proszę:
        </span>
        <span className="h4-text_tel lato-regular"> 690 029 414</span>
      </div>
    </div>
  );
}
