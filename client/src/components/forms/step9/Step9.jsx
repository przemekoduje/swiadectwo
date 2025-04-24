import React from "react";
import EmailForm from "../../emailForm/EmailForm";
import "./step9.scss";

/**
 * Krok 9 – podsumowanie.
 * Wyświetla pominięte pytania, umożliwia podgląd PDF‑a
 * i wysłanie go (razem z notatką) do zarządcy.
 */
export default function Step9({
  skippedQuestions = [], // lista { step, question, options }
  formData = {}, // wszystkie dane z poprzednich kroków
  generatePDF, // ➜ async (skippedQuestions) => BlobfinishRequest
  generateAndSendPDF,  
//   handleGenerateAndSendPDF, // ➜ async (from, to, note) => void
  prevStep, // cofnięcie do kroku 8
  resetForm, // rozpoczęcie od nowa
}) {
  /* =====================================
   *  Dane wczytane z formData – uzupełnią EmailForm
   * ===================================== */
  
  
  
  const {
    firstName = "",
    lastName = "",
    email = "",
  } = formData.step2Data || {};
  const { miasto = "", ulica = "" } = formData.step3Data || {};

  const senderName = `${firstName} ${lastName}`.trim();
  const propertyAddress = `${ulica}, ${miasto}`.trim();

  /* Zamykamy EmailForm wewnętrznie, ale ponieważ w tej wersji
     pokazujemy go zawsze – funkcja jest pustym placeholderem. */
  const handleCloseEmailForm = () => {};

  const missingLabels = {
    noExternal: "Brak zdjęcia budynku z zewnątrz",
    noPlan: "Brak rzutu nieruchomości",
    noCert: "Brak świadectwa budynku",
  };

  const files = formData.step8Data || {};
  const extra = Object.keys(missingLabels)
    .filter((key) => files[key]) // true = klient NIE ma pliku
    .map((key) => ({ step: 8, question: missingLabels[key] }));

    const allQuestions = [...skippedQuestions, ...extra];
  
  const handleEmail = (from, to, note) =>
  generateAndSendPDF(allQuestions, { from, to, note });

  return (
    <div className="step9">
      <h2 className="merriweather-light">Podsumowanie</h2>
      {/* 👉 tutaj możesz dopisać dowolne "kilka słów wyjaśnienia" */}
      <p className="lato-light">
        Poniżej znajdziesz listę pytań, na które nie udzielono odpowiedzi oraz
        możliwość wysłania ich w załączonym PDF‑ie do zarządcy nieruchomości.
      </p>

      {/* ====================================================
         SUMMARY
      ==================================================== */}
      <div className="summary">
        {/* 1. Podgląd PDF‑a */}
        <button
          onClick={async () => {
            try {
              const pdfBlob = await generatePDF([
                ...skippedQuestions,
                ...extra,
              ]);
              const pdfUrl = URL.createObjectURL(pdfBlob);
              window.open(pdfUrl, "_blank");
            } catch (err) {
              console.error("Błąd generowania PDF:", err);
            }
          }}
        >
          Otwórz PDF
        </button>

        {/* 2. Instrukcja */}
        <p className="form lato-light" style={{ marginTop: "15px" }}>
          Uzupełnij poniższe dane i wyślij plik PDF z pytaniami do zarządcy.
        </p>

        {/* 3. Debug – można usunąć w produkcji */}
        {console.log("Dane przekazywane do EmailForm:", {
          senderName,
          propertyAddress,
          from: email,
        })}

        {/* 4. Formularz e‑mail – dane wstępnie uzupełnione */}
        <EmailForm
          onClose={handleCloseEmailForm}
        //   handleGenerateAndSendPDF={handleGenerateAndSendPDF}
          handleGenerateAndSendPDF={handleEmail}
          senderName={senderName}
          propertyAddress={propertyAddress}
          from={email}
        />
      </div>

      {/* Nawigacja */}
      <div className="nav-buttons">
        <button className="back" onClick={prevStep}>
          &#x2190;
        </button>
        <button className="reset-button" onClick={resetForm}>
          Zacznij od nowa
        </button>
      </div>
    </div>
  );
}
