// pdfUtils.js – niezawodny generator PDF z fallbackiem na wbudowaną czcionkę
// --------------------------------------------------------------
// Jeśli chcesz polskie znaki: wrzuć plik TTF (np. „NotoSans-Regular.ttf”) do src/assets/fonts
// a nast. wygeneruj Base64:  npx ttf2base64 src/assets/fonts/NotoSans-Regular.ttf
// Skopiuj wynik i wklej do stałej BASE64_FONT. Jeżeli tego nie zrobisz – skrypt użyje
// domyślnej Helvetica (bez pełnego polskiego alfabetu, ale NIE wywali błędu Unicode).

import jsPDF from "jspdf";

// ▼  Wklej poniżej Base64 wygenerowany z Twojego TTF (bez nagłówka data:…; tylko czysty ciąg)
const BASE64_FONT = ""; // <- zostaw puste, jeśli nie masz własnej czcionki
const FONT_NAME   = "NotoSans";  // dowolna etykieta
const FONT_STYLE  = "normal";

// --------------------------------------------------------------
export const generatePDF = (skippedQuestions = []) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  /* 1.  Rejestracja czcionki – tylko raz na dokument */
  registerFont(doc);

  /* 2.  Layout podstawowy */
  const marginLeft = 20;
  const lineHeight = 8;
  let y = 20;

  doc.setFontSize(14);
  doc.text("Lista pytań", marginLeft, y);
  y += lineHeight * 1.5;

  doc.setFontSize(12);

  skippedQuestions.forEach((item, idx) => {
    y = addMultiline(doc, `${idx + 1}. ${item.question}`, marginLeft, y, lineHeight);

    (item.options || []).forEach((opt) => {
      y = addMultiline(doc, `- ${opt}`, marginLeft + 10, y, lineHeight);
    });

    y += lineHeight / 2; // przerwa między blokami
  });

  return doc.output("blob");
};

/* ------------------------------------------------------------ */
// Helper: dodaje tekst wieloliniowy + obsługa końca strony
function addMultiline(pdf, text, x, yPos, lh) {
  const lines = pdf.splitTextToSize(text, 170); // ok. 170 mm szerokości
  lines.forEach((line) => {
    if (yPos > 280) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.text(line, x, yPos);
    yPos += lh;
  });
  return yPos;
}

/* ------------------------------------------------------------ */
// Helper: próbuje zarejestrować czcionkę, w razie niepowodzenia używa Helvetiki
function registerFont(pdf) {
  // Czy font już istnieje?
  const fontKey = `${FONT_NAME}-${FONT_STYLE}`;
  if (pdf.getFontList()[fontKey]) {
    pdf.setFont(FONT_NAME, FONT_STYLE);
    return;
  }

  // Jeśli użytkownik wprowadził Base64 fontu – spróbuj zarejestrować
  if (BASE64_FONT && BASE64_FONT.length > 0) {
    try {
      pdf.addFileToVFS(`${FONT_NAME}.ttf`, BASE64_FONT);
      pdf.addFont(`${FONT_NAME}.ttf`, FONT_NAME, FONT_STYLE);
      pdf.setFont(FONT_NAME, FONT_STYLE);
      return;
    } catch (e) {
      console.warn("Nie udało się zarejestrować czcionki, przechodzę na Helvetica", e);
    }
  }

  // Fallback – Helvetica
  pdf.setFont("helvetica", "normal");
}
