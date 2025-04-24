import React, { useEffect, useState } from "react";
import "./step5.scss";
import CustomSelect from "../../customSelect/CustomSelect";

export default function Step5({
  nextStep,
  prevStep,
  skippedQuestions,
  setSkippedQuestions,
  data,
  setData,
  resetCurrentStep,
  addSkippedQuestion,
  removeSkippedQuestion,
  handleFieldFocus,
  saveDraft,
}) {




  const [tempData, setTempData] = useState(() => {
    const savedData = localStorage.getItem("step5FormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          ogrzewanie: "",
          wodaciepla: "",
          grzejniki: "",
          wentylacja: "",
          szyby: "",
        };
  });

  const [powOptions] = useState([
    "--Brak informacji",
    "sieć miejska",
    "grzejniki elektryczne",
    "kocioł na biomase",
    "kocioł na ekogroszek",
    "kocioł węglowy",
    "kocioł olejowy",
    "kocioł gazowy w mieszkaniu",
    "kocioł gazowy w kotłowni",
    "kocioł gazowy w kotłowni zewn.",
    "energia geotermalna",
    "piec kaflowy",
  ]);

  const [wodaOptions] = useState([
    "--Brak informacji",
    "sieć miejska",
    "elektryczny podgrzewacz akumulacyjny",
    "elektryczny podgrzewacz przepływowy",
    "kocioł na biomase",
    "kocioł na ekogroszek",
    "kocioł węglowy",
    "kocioł olejowy",
    "kocioł gazowy w mieszkaniu",
    "kocioł gazowy w kotłowni",
    "kocioł gazowy w kotłowni zewn.",
    "energia geotermalna",
    "piec kaflowy",
  ]);

  const [grzejnikOptions] = useState([
    "--Brak informacji",
    "płytowe",
    "żeliwne",
    "członowe",
    "podłogowe",
    "ogrzewanie piecowe lub kominkowe",
  ]);

  const [wentylOptions] = useState([
    "--Brak informacji",
    "grawitacyjna",
    "mechaniczna wywiewna",
    "mechaniczna wywiewno-nawiewna",
  ]);

  const [skipButtonsDisabled, setSkipButtonsDisabled] = useState({
    ogrzewanie: false,
    wodaciepla: false,
    grzejniki: false,
    wentylacja: false,
    szyby: false,
  });

  const [tempSkippedQuestions, setTempSkippedQuestions] =
    useState(skippedQuestions);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });

    if (name === "szyby" && value === "0") {
      // If szyby is 0, skip the question
      skipQuestion(name);
    } else if (value === "--Brak informacji") {
      skipQuestion(name, getOptionsForQuestion(name));
    } else {
      setTempSkippedQuestions((prev) =>
        prev.filter((item) => item.question !== name)
      );
    }
  };

  const getOptionsForQuestion = (question) => {
    switch (question) {
      case "ogrzewanie":
        return powOptions;
      case "wodaciepla":
        return wodaOptions;
      case "grzejniki":
        return grzejnikOptions;
      case "wentylacja":
        return wentylOptions;
      default:
        return [];
    }
  };

  const skipQuestion = (question) => {
    if (!tempSkippedQuestions.some((item) => item.question === question)) {
      setTempSkippedQuestions((prev) => [
        ...prev,
        { step: 5, question, options: getOptionsForQuestion(question) },
      ]);
    }
  };

  const handleNextStep = () => {
    saveDraft(5, tempData);
    setData((prevData) => ({
      ...prevData,
      ...tempData,
    }));

    setSkippedQuestions(tempSkippedQuestions);

    localStorage.setItem("step5FormData", JSON.stringify(tempData));

    nextStep();
  };

  const isFormValid = () => {
    const allFieldsFilled = Object.values(tempData).every(
      (value) => value.trim() !== ""
    );

    return allFieldsFilled;
  };

  return (
    <div className="step5">
      <h2 className="merriweather-light">Szczegółowe dane nieruchomości 5</h2>

      <div className="inputs">
        {/* Ogrzewanie */}
        {/* <div className="input-wrapper">
          <label
            className={`lato-light ${tempData.ogrzewanie ? "active" : ""}`}
          >
            Wybierz rodzaj ogrzewania
          </label>
          <select
            className="lato-light"
            name="ogrzewanie"
            value={tempData.ogrzewanie}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Wybierz rodzaj ogrzewania
            </option>
            {powOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div> */}

        <CustomSelect
          label="Wybierz rodzaj ogrzewania"
          options={powOptions}
          name="ogrzewanie"
          value={tempData.ogrzewanie}
          onChange={handleChange}
          onFocus={() => {
            console.log("🔥 onFocus działa dla: ogrzewanie!");
            handleFieldFocus("ogrzewanie");
          }}
        />

        {/* Źródło ciepłej wody */}
        {/* <div className="input-wrapper">
          <label
            className={`lato-light ${tempData.wodaciepla ? "active" : ""}`}
          >
            Wybierz źródło ciepłej wody
          </label>
          <select
            className="lato-light"
            name="wodaciepla"
            value={tempData.wodaciepla}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Wybierz źródło ciepłej wody
            </option>
            {wodaOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div> */}

        <CustomSelect
          label="Wybierz źródło ciepłej wody"
          options={wodaOptions}
          value={tempData.wodaciepla}
          onChange={handleChange}
          name="wodaciepla"
          onFocus={() => handleFieldFocus("wodaciepla")}
        />

        {/* Grzejniki */}
        {/* <div className="input-wrapper">
          <label className={`lato-light ${tempData.grzejniki ? "active" : ""}`}>
            Wybierz rodzaj grzejników
          </label>
          <select
            className="lato-light"
            name="grzejniki"
            value={tempData.grzejniki}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Wybierz rodzaj grzejników
            </option>
            {grzejnikOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div> */}
        
        <CustomSelect
            label="Wybierz rodzaj grzejników"
            options={grzejnikOptions}
            value={tempData.grzejniki}
            onChange={handleChange}
            name="grzejniki"
            onFocus={() => handleFieldFocus("grzejniki")}
          />
        {/* Wentylacja */}
        {/* <div className="input-wrapper">
          <label
            className={`lato-light ${tempData.wentylacja ? "active" : ""}`}
          >
            Wybierz rodzaj wentylacji
          </label>
          <select
            className="lato-light"
            name="wentylacja"
            value={tempData.wentylacja}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Wybierz rodzaj wentylacji
            </option>
            {wentylOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div> */}
        
        <CustomSelect
            label="Wybierz rodzaj wentylacji"
            options={wentylOptions}
            value={tempData.wentylacja}
            onChange={handleChange}
            name="wentylacja"
            onFocus={() => handleFieldFocus("wentylacja")}
          />

        {/* Liczba szyb */}
        <div className="input-wrapper">
          <input
            className="lato-light"
            type="number"
            name="szyby"
            value={tempData.szyby}
            onChange={handleChange}
            onFocus={() => handleFieldFocus("szyby")}
            required
          />
          <label className={`lato-light ${tempData.szyby ? "active" : ""}`}>
            Liczba szyb w oknach [szt] --(wpisz 0 jeśli brak danych)
          </label>
        </div>
      </div>

      <button className="back" onClick={prevStep}>
        &#x2190;
      </button>
      <button onClick={handleNextStep} disabled={!isFormValid()}>
        Dalej
      </button>
    </div>
  );
}
