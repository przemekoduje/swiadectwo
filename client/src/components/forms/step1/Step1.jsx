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
        <p>W kilku punktach przedstawiam proces przygotowania świadectwa:</p>
        <ul>
          <li>
            Wypełnij do końca odpowiedzi w formularzu. Formularz podzielony jest
            na klika kroków.
          </li>
          <li>Jeśli nie znasz odpowiedzi - wybierz “Brak informacji lub '0' w odpowiednim miejscu.”</li>
          <li>
            W ten sposób zostanie przygotowany zestaw pytań do Zarządcy. Bedzie automatycznie gotowy do wysłania na wskazanego maila na końcu formularza.
          </li>
          <li>
            Zarządca przygotuje odpowiedzi na brakujące pytania i wyśle je
            prosto do nas.
          </li>
          <li>
            My w miedzyczasie skontaktujemy sie z Tobą aby omówić szczegóły
            zlecenia.
          </li>
          <li>
            Przygotowujemy nastepnie świadectwo i wysyłamy w ustalonej formie.
          </li>
        </ul>
        <p>Wszystko może trwać nawet tylko 24 godziny. </p>
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
