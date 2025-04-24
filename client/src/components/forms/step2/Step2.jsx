import React, { useState, useEffect } from "react";
import "./step2.scss";

export default function Step2({ nextStep, prevStep, setData, saveDraft }) {
  // Inicjalizowanie stanu z localStorage, jeśli dane istnieją
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("step2FormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        };
  });

  // Funkcja obsługująca zmianę w inputach
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    saveDraft(2, formData);
    setData(formData); // ← ZAPISUJEMY do globalnego stanu
    nextStep();
  };

  useEffect(() => {
    // Zapisywanie stanu do localStorage po każdej zmianie
    localStorage.setItem("step2FormData", JSON.stringify(formData));
  }, [formData]);

  // Sprawdza, czy wszystkie pola są wypełnione
  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  return (
    <div className="step2">
      <h2 className="merriweather-light">Poznajmy się zatem proszę</h2>
      <p>Poniższe dane umoliwią nam późniejszy kontakt</p>
      <div className="inputs">
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.firstName ? "active" : ""}`}>
            Imię
          </label>
        </div>
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.lastName ? "active" : ""}`}>
            Nazwisko
          </label>
        </div>
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.email ? "active" : ""}`}>
            Email
          </label>
        </div>
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <label className={`lato-light ${formData.phone ? "active" : ""}`}>
            Telefon
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
