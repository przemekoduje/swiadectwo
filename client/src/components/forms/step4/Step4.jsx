import React, { useEffect, useState } from "react";
import "./step4.scss";

export default function Step4({
  nextStep,
  prevStep,
  handleFieldFocus,
  addSkippedQuestion,
  setSkippedQuestions,
  setData,
  saveDraft,
}) {
  // Inicjalizowanie stanu z localStorage, jeśli dane istnieją

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("step4FormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          powierzchnia: "",
          wysokosc: "",
          liczbascian: "",
        };
  });

  // Funkcja obsługująca zmianę w inputach
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // jeśli użytkownik wpisze 0 w „liczbascian”, potraktuj to jako brak danych
    if (name === "liczbascian") {
      if (value === "0" || value === "") {
        addSkippedQuestion?.(4, "liczbascian");
      } else {
        // użytkownik podał wartość > 0 -> usuń z listy pominiętych
        setSkippedQuestions?.((prev) =>
          prev.filter((q) => q.question !== "liczbascian")
        );
      }
    }
  };

  // Sprawdza, czy wszystkie pola są wypełnione
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  useEffect(() => {
    // Zapisywanie stanu do localStorage po każdej zmianie
    localStorage.setItem("step4FormData", JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    saveDraft(4, formData);
    /** kluczowa linijka – zapis do globalnego stanu */
    setData(formData);
    nextStep();
  };

  return (
    <div className="step4">
      <h2 className="merriweather-light">Podstawowe dane nieruchomości</h2>
      <div className="inputs">
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="number"
            name="powierzchnia"
            value={formData.powierzchnia}
            onChange={handleChange}
            required
          />
          <label
            className={`lato-light ${formData.powierzchnia ? "active" : ""}`}
          >
            Powierzchnia użytkowa /np. 64,5/ [m2]
          </label>
        </div>
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="number"
            name="wysokosc"
            value={formData.wysokosc}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.wysokosc ? "active" : ""}`}>
            Wysokość pomieszczeń [cm]
          </label>
        </div>
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="number"
            name="liczbascian"
            value={formData.liczbascian}
            onChange={handleChange}
            required
            onFocus={() => handleFieldFocus("liczbascian")}
          />
          <label
            className={`lato-light ${formData.liczbascian ? "active" : ""}`}
          >
            Liczba ścian zewnętrznych
          </label>
        </div>
      </div>

      <button className="back" onClick={prevStep}>
        &#x2190;
      </button>
      <button onClick={handleNext} disabled={!isFormValid}>
        Dalej
      </button>
    </div>
  );
}
