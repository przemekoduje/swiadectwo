import React, { useState, useEffect } from "react";
import "./step1.scss";

export default function Step1({ nextStep }) {
  // Inicjalizowanie stanu z localStorage, jeśli dane istnieją
  const [selectedOption, setSelectedOption] = useState(() => {
    const savedOption = localStorage.getItem("step1SelectedOption");
    return savedOption ? JSON.parse(savedOption) : "";
  });

  // Funkcja obsługująca zmianę zaznaczonej opcji
  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    // Zapisywanie wybranej opcji do localStorage
    localStorage.setItem("step1SelectedOption", JSON.stringify(value));
  };

  useEffect(() => {
    // Zapisywanie stanu do localStorage po każdej zmianie
    localStorage.setItem("step1SelectedOption", JSON.stringify(selectedOption));
  }, [selectedOption]);

  return (
    <div className="step1">
      <h2 className="merriweather-light">Hej, tu Przemek.</h2>
      <div className="dates">
        <p>Jak wygląda proces przygotowania świadectwa?</p>
        <ul>
          <li>Wypełnij formularz – krok po kroku. Jeśli czegoś nie wiesz, wybierz "Brak informacji".</li>
          <li>Na końcu automatycznie wygenerujemy listę pytań do Zarządcy nieruchomości.</li>
          <li>Zarządca odeśle brakujące dane, a my zajmiemy się resztą.</li>
          <li>W międzyczasie skontaktujemy się z Tobą w celu omówienia szczegółów.</li>
          <li>Świadectwo przygotowujemy i wysyłamy nawet w 24 godziny!</li>
        </ul>
        <p>Chcesz szybciej? Zadzwoń: <strong>690 029 414</strong></p>
        
        {/* Przycisk "Dalej" jest aktywny tylko, gdy wybrano jedną z opcji */}
        <button
          className="step_button"
          onClick={nextStep}
        // disabled={!selectedOption} // Przycisk nieaktywny, jeśli nic nie zaznaczono
        >
          Dalej
        </button>
      </div>
    </div>
  );
}
