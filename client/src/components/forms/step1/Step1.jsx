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
      <h2 className="merriweather-light">Hej, jestem Przemek.</h2>
      <div className="dates">
        <p>W kilku punktach przedstawiam proces przygotowania świadectwa:</p>
        <ol>
          <li>
            Wypełnij do końca odpowiedzi w formularzu. Formularz podzielony jest
            na klika kroków.
          </li>
          <li>Jeśli nie znasz odpowiedzi - wybierz “Brak informacji”</li>
          <li>
            Zestaw pytań do Zarządcy zostanie przygotowany zostanie w ten sposób
            do wysłania na wskazanego maila na końcu formularza.
          </li>
          <li>
            Zarządca przygotuje odpowiedzi na brakujące pytania i wyśle je
            prosto do nas
          </li>
          <li>
            My w miedzyczasie zadzwonimy do Ciebie aby omówić szczegóły
            zlecenia.
          </li>
          <li>
            Przygotowujemy nastepnie świadectwo i wysyłamy w ustalonej formie.
          </li>
        </ol>
        <p>Wszystko może trwa nawet tylko 48 godzin. </p>
        <p>Idziemy dalej?</p>
      </div>
      {/* Przycisk "Dalej" jest aktywny tylko, gdy wybrano jedną z opcji */}
      <button
        className="lato-light"
        onClick={nextStep}
        // disabled={!selectedOption} // Przycisk nieaktywny, jeśli nic nie zaznaczono
      >
        Dalej
      </button>
    </div>
  );
}
