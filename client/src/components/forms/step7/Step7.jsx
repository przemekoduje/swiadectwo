import React, { useEffect, useState } from "react";
import "./step7.scss";

export default function Step7({
  prevStep,
  nextStep,
  data = {},          // z FormPage
  setData,
  saveDraft,          // helper Firestore
  handleFieldFocus,   // (jeśli używasz)
}) {
  /* ========== lokalny stan ========== */
  const [selectedOptions, setSelectedOptions] = useState(
    data.selectedOptions || {
      klimatyzacja: false,
      fotowoltaika: false,
      balkon: false,
      parter: false,
      ostatniePietro: false,
    }
  );
  const [komentarz, setKomentarz] = useState(data.komentarz || "");

  /* ---------- zapisy do localStorage (jak było) ---------- */
  useEffect(() => {
    localStorage.setItem(
      "step7SelectedOptions",
      JSON.stringify(selectedOptions)
    );
  }, [selectedOptions]);

  useEffect(() => {
    localStorage.setItem("step7Komentarz", komentarz);
  }, [komentarz]);

  /* ---------- obsługa zmian ---------- */
  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions((prev) => ({ ...prev, [name]: checked }));
  };
  const handleKomentarzChange = (e) => setKomentarz(e.target.value);

  /* ---------- przejście dalej ---------- */
  const handleNext = () => {
    const stepData = { selectedOptions, komentarz };
    saveDraft(7, stepData);  //  ➜ Firestore
    setData(stepData);       //  ➜ global state w FormPage
    nextStep();
  };

  /* ========== RENDER ========== */
  return (
    <div className="step7">
      <h2 className="merriweather-light">Informacje pozostałe</h2>

      <div className="dates lato-light">
        {[
          ["klimatyzacja", "Zaznacz, jeśli budynek posiada klimatyzację"],
          ["fotowoltaika", "Zaznacz, jeśli budynek posiada fotowoltaikę"],
          ["balkon", "Zaznacz, jeśli jest balkon/taras"],
          ["parter", "Zaznacz, jeśli mieszkanie jest na parterze"],
          ["ostatniePietro", "Zaznacz, jeśli mieszkanie jest na ostatnim piętrze"],
        ].map(([name, label]) => (
          <label key={name}>
            <input
              type="checkbox"
              name={name}
              checked={selectedOptions[name]}
              onChange={handleOptionChange}
            />{" "}
            {label}
          </label>
        ))}
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="textArea"
          name="komentarz"
          value={komentarz}
          onChange={handleKomentarzChange}
          rows="6"
          placeholder="Wpisz inne istotne informacje."
        />
      </div>

      <button className="back" onClick={prevStep}>
        &#x2190;
      </button>
      <button className="lato-light" onClick={handleNext}>
        Dalej
      </button>
    </div>
  );
}
