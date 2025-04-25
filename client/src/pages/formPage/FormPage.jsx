import React, { useState, useEffect } from "react";
import "./formPage.scss";
import Step1 from "../../components/forms/step1/Step1";
import Step2 from "../../components/forms/step2/Step2";
import Step3 from "../../components/forms/step3/Step3";
import Step4 from "../../components/forms/step4/Step4";
import Step5 from "../../components/forms/step5/Step5";
import Step6 from "../../components/forms/step6/Step6";
import Step7 from "../../components/forms/step7/Step7";
import Step8 from "../../components/forms/step8/Step8";
import Step9 from "../../components/forms/step9/Step9";

import EmailForm from "../../components/emailForm/EmailForm";
import jsPDF from "jspdf";
import ChatWidget from "chat-widget";
// import { generatePDF } from "../../utils/pdfUtils";

import { addDoc, collection, serverTimestamp, doc, setDoc, } from "firebase/firestore";
import { db } from "../../firebase"; // ścieżka do Twojej inicjalizacji

/* --- Firestore helpers ------------------------------------ */
export function getRequestId() {
  let id = localStorage.getItem("currentRequestId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("currentRequestId", id);
  }
  return id;
}

export async function saveDraft(step, data) {
  const id = getRequestId();
  const ref = doc(collection(db, "cert_requests"), id);

  await setDoc(
    ref,
    {
      [`form.step${step}`]: data,
      status: "DRAFT",
      "timestamps.createdAt": serverTimestamp(),
    },
    { merge: true }
  );
}

export async function finishRequest() {
  const id = localStorage.getItem("currentRequestId");
  if (!id) return;                         // brak id → nic do roboty

  const ref = doc(collection(db, "cert_requests"), id);
  await setDoc(
    ref,
    {
      status: "SUBMITTED",
      "timestamps.sentAt": serverTimestamp(),
    },
    { merge: true }
  );
  localStorage.removeItem("currentRequestId");
}




export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // 📌 Pobieranie sugerowanych pytań na podstawie aktualnego kroku formularza
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/suggested-questions/${currentStep}`)
      .then((res) => res.json())
      .then((data) => setSuggestedQuestions(data.questions))
      .catch((err) => console.error("Błąd pobierania pytań:", err));
  }, [currentStep]);

  // 📌 Dynamiczna zmiana pytania na podstawie aktywnego inputa
  const handleFieldFocus = (fieldName) => {
    console.log(
      `🔍 Wysyłam zapytanie o pytania dla: step=${currentStep}, field=${fieldName}`
    );

    fetch(
      `${process.env.REACT_APP_API_BASE}/suggested-questions/${currentStep}/${fieldName}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Pobrane pytania:", data.questions);
        setSuggestedQuestions(data.questions);
      })
      .catch((err) => console.error("Błąd pobierania pytań:", err));
  };

  // const stepQuestions = {
  //   1: ["Jak uzyskać świadectwo energetyczne?", "Jak długo jest ważne?"],
  //   2: ["Jakie dokumenty są potrzebne?", "Czy oferujecie rabaty?"],
  //   3: ["Jak działa audyt?", "Czy audyt jest obowiązkowy?"],
  //   4: ["Czy mogę uzyskać dofinansowanie?", "Jakie są wymagania prawne?"],
  //   5: ["Jakie są możliwe źródła ciepła w budynku?", "Czy pompa ciepła jest lepsza od gazu?"],
  //   6: ["Jakie są standardy izolacji?", "Czym różni się styropian od wełny mineralnej?"],
  //   7: ["Czy warto inwestować w rekuperację?", "Jak działa wentylacja mechaniczna?"],
  //   8: ["Jak poprawić efektywność energetyczną?", "Jak oszczędzać na ogrzewaniu?"],
  // };

  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleCloseEmailForm = () => {
    setShowEmailForm(false);
  };

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
        step1Data: {},
        step2Data: {},
        step3Data: {},
        step4Data: {},
        step5Data: {},
        step6Data: {},
        step7Data: {},
        step8Data: {},
      };
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("currentStep", currentStep);
  }, [formData, currentStep]);

  const resetForm = () => {
    localStorage.removeItem("step1SelectedOption");
    localStorage.removeItem("step7SelectedOptions");
    localStorage.removeItem("formData");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("step2FormData");
    localStorage.removeItem("step3FormData");
    localStorage.removeItem("step4FormData");
    localStorage.removeItem("step5FormData");
    localStorage.removeItem("step6FormData");
    localStorage.removeItem("step7Komentarz");
    localStorage.removeItem("step7SelectedOpti");

    localStorage.removeItem("currentRequestId");

    setFormData({
      step1Data: {},
      step2Data: {},
      step3Data: {},
      step4Data: {},
      step5Data: {},
      step6Data: {},
      step7Data: {
        komentarz: "",
        selectedOptions: {},
      },
      step8Data: {},
    });

    setCurrentStep(1);
    setSkippedQuestions([]); // Zresetowanie pominiętych pytań
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      const next = prevStep + 1;
      localStorage.setItem("currentStep", next);
      return next;
    });
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => {
        const prev = prevStep - 1;
        localStorage.setItem("currentStep", prev);
        return prev;
      });
    }
  };

  const resetCurrentStep = () => {
    setFormData((prevData) => {
      const newData = { ...prevData, [`step${currentStep}Data`]: {} };
      localStorage.setItem("formData", JSON.stringify(newData));
      return newData;
    });
  };

  const updateFormData = (step, data) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [`step${step}Data`]: data };
      localStorage.setItem("formData", JSON.stringify(newData));
      return newData;
    });
  };

  // Funkcja dodająca pytanie do pominiętych, z opcjami
  const addSkippedQuestion = (step, question, options = []) => {
    setSkippedQuestions((prevQuestions) => [
      ...prevQuestions,
      { step, question, options },
    ]);
  };

  const handleResetClick = () => {
    setShowConfirmation(true);
  };

  const handleCancelReset = () => {
    setShowConfirmation(false);
  };

  const handleConfirmReset = () => {
    resetForm();
    setShowConfirmation(false);
  };

  // Funkcja do renderowania listy pominiętych pytań wraz z opcjami
  const renderSkippedQuestions = () => (
    <div>
      <h2>Pominięte pytania:</h2>
      {skippedQuestions.length > 0 ? (
        skippedQuestions.map((item, index) => (
          <div key={index}>
            <p>
              <strong>Krok {item.step}:</strong> {item.question}
            </p>
            {item.options.length > 0 && (
              <ul>
                {item.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>Brak pominiętych pytań</p>
      )}
    </div>
  );

  const LABELS = {
    ogrzewanie: "Podaj źródło ogrzewania nieruchomości",
    wodaciepla: "Podaj źródło ciepłej wody",
    grzejniki: "Wybierz rodzaj grzejników",
    wentylacja: "Wybierz rodzaj wentylacji",
    liczbascian: "Liczba ścian zewnętrznych",
    szyby: "Ile szyb jest w zestawie okiennym",
    sciana: "Materiał ścian zewnętrznych",
    scianagrubosc: "Grubość ściany zewnętrznej",
    izolacja: "Materiał izolacji ściany zewnętrznej",
    izolacjagrubosc: "Grubość materiału izolacyjnego",
    rok: "Rok oddania budynku do użytku",
    termo: "Rok ostatniej termomodernizacji",
  };

  const generateAndSendPDF = async (questions, { from, to, note }) => {
    // 1. budujemy Blob tak samo jak w podglądzie
    const pdfBlob = await generatePDF(questions);

    // 2. upload na backend
    const data = new FormData();
    data.append("pdf", pdfBlob, "pytania.pdf");

    await fetch(`${process.env.REACT_APP_API_BASE}/api/upload-pdf`, {
      method: "POST",
      body: data,
    });

    // 3. wysyłka maila (backend już zna ścieżkę PDF‑a)
    await fetch(`${process.env.REACT_APP_API_BASE}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, note }),
    });

    await finishRequest(); resetForm();

    /* 3. ZAPIS DO FIRESTORE ----------------------------- */
    const agentPhone =
      new URLSearchParams(window.location.search).get("ref") || null;
    const clientPhone = formData.step2Data.phone || null;

    // tylko jeśli któryś numer istnieje
    if (clientPhone || agentPhone) {
      await addDoc(collection(db, "leads_submitted"), {
        agentPhone,
        clientPhone,
        timestamp: serverTimestamp(),
      });
    }
  };

  const generatePDF = async (skippedQuestions) => {
    const doc = new jsPDF();

    /* ——— Ładowanie czcionki (jeśli potrzebujesz) ——— */
    const fontResp = await fetch("/fonts/Roboto-Regular.ttf");
    const fontBlob = await fontResp.blob();
    const base64Font = await blobToBase64(fontBlob);

    doc.addFileToVFS("Roboto.ttf", base64Font);
    doc.addFont("Roboto.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    /* ———————————————————————————————— */

    doc.setFontSize(14);
    doc.text("Lista pytań", 20, 20);

    let y = 30; // aktualna pozycja
    const line = 8; // wysokość linii

    skippedQuestions.forEach(({ step, question, options = [] }, idx) => {
      // pytanie
      const prettyQuestion = LABELS[question] || question; // fallback
      doc.text(`${idx + 1}. ${prettyQuestion}`, 20, y);
      y += line;

      // ewentualne opcje
      options.forEach((opt) => {
        doc.text(`- ${opt}`, 30, y);
        y += line;
      });

      // jeśli zbliżamy się do końca strony
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    return doc.output("blob");

    /* helper zamieniający Blob w Base64 */
    function blobToBase64(blob) {
      return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(blob);
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            handleFieldFocus={handleFieldFocus}
            data={formData.step1Data}
            setData={(data) => updateFormData(1, data)}
            nextStep={nextStep}
            prevStep={prevStep}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
          />
        );
      case 2:
        return (
          <Step2
            handleFieldFocus={handleFieldFocus}
            data={formData.step2Data}
            setData={(data) => updateFormData(2, data)}
            nextStep={nextStep}
            prevStep={prevStep}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
            saveDraft={saveDraft}
          />
        );
      case 3:
        return (
          <Step3
            handleFieldFocus={handleFieldFocus}
            data={formData.step3Data}
            setData={(data) => updateFormData(3, data)}
            nextStep={nextStep}
            prevStep={prevStep}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
            saveDraft={saveDraft}
          />
        );
      case 4:
        return (
          <Step4
            handleFieldFocus={handleFieldFocus}
            data={formData.step4Data}
            setData={(data) => updateFormData(4, data)}
            nextStep={nextStep}
            prevStep={prevStep}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
            setSkippedQuestions={setSkippedQuestions}
            saveDraft={saveDraft}
          />
        );
      case 5:
        return (
          <Step5
            handleFieldFocus={handleFieldFocus}
            nextStep={nextStep}
            prevStep={prevStep}
            skippedQuestions={skippedQuestions}
            setSkippedQuestions={setSkippedQuestions}
            data={formData.step5Data}
            setData={(data) => updateFormData(5, data)}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
            saveDraft={saveDraft}
          />
        );
      case 6:
        return (
          <Step6
            handleFieldFocus={handleFieldFocus}
            nextStep={nextStep}
            prevStep={prevStep}
            skippedQuestions={skippedQuestions}
            setSkippedQuestions={setSkippedQuestions}
            data={formData.step6Data}
            setData={(data) => updateFormData(6, data)}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
            saveDraft={saveDraft}
          />
        );
      case 7:
        return (
          <Step7
            handleFieldFocus={handleFieldFocus}
            data={formData.step7Data}
            setData={(data) => updateFormData(7, data)}
            nextStep={nextStep}
            prevStep={prevStep}
            resetCurrentStep={resetCurrentStep}
            addSkippedQuestion={addSkippedQuestion}
            saveDraft={saveDraft}
          />
        );
      case 8:
        return (
          <div>
            <Step8
              handleFieldFocus={handleFieldFocus}
              data={formData.step8Data}
              setData={(data) => updateFormData(8, data)}
              nextStep={nextStep}
              prevStep={prevStep}
              resetCurrentStep={resetCurrentStep}
              addSkippedQuestion={addSkippedQuestion}
              saveDraft={saveDraft}
            />
            {/* {renderSkippedQuestions()} Wyświetlenie pominiętych pytań */}
            {/* <button onClick={generateAndSendPDF}>
              Generuj PDF z pominiętymi pytaniami
            </button> */}
          </div>
        );

      case 9:
        return (
          <Step9
            skippedQuestions={skippedQuestions}
            formData={formData}
            generatePDF={generatePDF}
            generateAndSendPDF={generateAndSendPDF}
            prevStep={prevStep}
            resetForm={resetForm}
          />
        );

      default:
        return <Step1 nextStep={nextStep} />;
    }
  };

  return (
    <div className="form-page">
      {/* ✅ Chatbot dynamicznie zmienia pytania w zależności od kroku formularza */}
      <ChatWidget suggestedQuestions={suggestedQuestions} />

      <div className={`content ${showConfirmation ? "blur-background" : ""}`}>
        <div className="headPhoto">
          <img src="/images/profil.jpg" alt="Profile" />
        </div>
        <hr className="full-width-line" />

        <div className="left-section">
          <img
            src="/images/back05 2.png"
            alt="Background"
            className="reacting-image"
          />
        </div>

        <div className="right-section">
          {/* Przycisk + popup pojawią się tylko w kroku 8 */}

          {currentStep === 9 && (
            <>
              {/* <button onClick={handleShowEmailForm}>Wyślij e‑mail</button> */}

              {showEmailForm && (
                <EmailForm
                  onClose={handleCloseEmailForm}
                  senderName={`${formData.step2Data.firstName || ""} ${formData.step2Data.lastName || ""
                    }`}
                  propertyAddress={`${formData.step3Data.ulica || ""} ${formData.step3Data.miasto || ""
                    }`}
                  from={formData.step2Data.email || ""}
                />
              )}
            </>
          )}

          {renderStep()}

        </div>
        <button className="reset-button" onClick={handleResetClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#5f6368"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" />
          </svg>
        </button>
      </div>

      {showConfirmation && (
        <div className="confirmation-popup lato-light">
          <h3>Rozpoczynamy od nowa?</h3>
          <p>To spowoduje wyczyszczenie pól formularza i powrót do początku</p>
          <div className="confirmation-buttons">
            <button onClick={handleConfirmReset}>Tak</button>
            <button onClick={handleCancelReset}>Nie</button>
          </div>
        </div>
      )}
    </div>
  );
}
