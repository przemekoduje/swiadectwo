import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url"; // Importujemy z `url`, aby utworzyć `__dirname`
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { readFile, writeFile } from "fs/promises";

import similarity from "string-similarity";

// Ładowanie zmiennych środowiskowych
dotenv.config();

const app = express();

// Definiowanie `__dirname` w module ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware do obsługi danych w formacie JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

// Serwowanie plików statycznych
app.use(express.static(path.join(__dirname, "public")));

// Upewnij się, że folder do zapisu PDF istnieje
const pdfDirectory = path.join(__dirname, "public", "pdf");
if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory, { recursive: true });
}

const uploadsDirectory = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// Ustawienia Multer - miejsce, gdzie będą zapisywane pliki
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDirectory); // Ścieżka, gdzie mają być zapisywane pliki
  },
  filename: (req, file, cb) => {
    // Stała nazwa pliku: 'pytaniaChat.pdf'
    cb(null, "pytaniaChat.pdf");
  },
});

// Ustawienia Multer dla plików graficznych
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "public", "uploads");
    // Sprawdź, czy folder istnieje, jeśli nie - stwórz go
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Przechowuj pliki w folderze public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unikalna nazwa pliku
  },
});

const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit 10 MB
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit na plik
});

app.post(
  "/api/send-form-data",
  uploadImages.fields([
    { name: "exteriorPhoto", maxCount: 1 },
    { name: "propertyLayout", maxCount: 1 },
    { name: "additionalPhoto", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Otrzymane body:", req.body); // Sprawdź dane formularza
    console.log("Otrzymane pliki:", req.files); // Sprawdź przesłane pliki

    let userAnswers;
    try {
      userAnswers = JSON.parse(req.body.userAnswers); // Parsowanie JSON-a
    } catch (error) {
      console.error("Błąd parsowania JSON:", error);
      return res.status(400).json({ message: "Invalid form data" });
    }

    const uploadedFiles = req.files; // Pliki załączone przez użytkownika

    if (!userAnswers || Object.keys(userAnswers).length === 0) {
      return res.status(400).json({ message: "No form data provided" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("Otrzymano dane użytkownika:", userAnswers);
    console.log("Otrzymano pliki:", uploadedFiles);

    res.status(200).json({
      message: "Dane i pliki zostały pomyślnie przesłane!",
      files: uploadedFiles,
    });
  }
);

// Endpoint do przesyłania pliku PDF
app.post("/api/upload-pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filePath: "/public/pdf/pytaniaChat.pdf",
  });
});

// Endpoint do wysyłania e-maili z załączonym plikiem PDF
app.post("/api/send-email", async (req, res) => {
  const { from, to, note } = req.body;

  if (!from || !to || !note) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Konfiguracja transportu nodemailer z użyciem Gmaila
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from,
    to,
    subject: "Wiadomość z formularza",
    text: note,
    replyTo: from,
    attachments: [
      {
        filename: "pytaniaChat.pdf", // Plik będzie miał nazwę 'pytaniaChat.pdf'
        path: path.join(__dirname, "public", "pdf", "pytaniaChat.pdf"),
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Endpoint do wysyłania e-maili z załączonymi plikami
app.post("/api/send-data-email", async (req, res) => {
  const { userAnswers } = req.body; // Dane użytkownika
  // const uploadedFiles = req.files; // Pliki załączone przez użytkownika

  if (!userAnswers) {
    return res.status(400).json({ message: "Missing required data or files" });
  }

  // Konfiguracja transportu nodemailer z użyciem Gmaila
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Email nadawcy (np. serwera)
      pass: process.env.EMAIL_PASS, // Hasło do konta e-mail (lub specjalne hasło aplikacji)
    },
  });

  // // Przygotowanie załączników
  // const attachments = [];
  // if (uploadedFiles.exteriorPhoto) {
  //   attachments.push({
  //     filename: uploadedFiles.exteriorPhoto[0].originalname,
  //     path: uploadedFiles.exteriorPhoto[0].path,
  //   });
  // }
  // if (uploadedFiles.propertyLayout) {
  //   attachments.push({
  //     filename: uploadedFiles.propertyLayout[0].originalname,
  //     path: uploadedFiles.propertyLayout[0].path,
  //   });
  // }
  // if (uploadedFiles.additionalPhoto) {
  //   attachments.push({
  //     filename: uploadedFiles.additionalPhoto[0].originalname,
  //     path: uploadedFiles.additionalPhoto[0].path,
  //   });
  // }

  // Treść wiadomości e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER, // Nadawca
    to: "przemek.rakotny@gmail.com", // Odbiorca (admin)
    subject: "Nowe dane użytkownika z formularza", // Temat
    text: `Otrzymano nowe dane od użytkownika:\n\n${JSON.stringify(
      userAnswers,
      null,
      2
    )}`,
  };

  try {
    // Wysyłanie e-maila
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-mail sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

//chatbot
// 📌 Wczytanie `faq.json` z obsługą błędów
let faqData = [];
try {
  faqData = JSON.parse(
    await readFile(new URL("./knowledge-base/faq.json", import.meta.url))
  );
  console.log("✅ FAQ załadowane pomyślnie");
} catch (error) {
  console.error("❌ Błąd ładowania `faq.json`:", error);
}

// 📌 Konwersja FAQ do prostszej struktury
const knowledgeBase = [...faqData];

// 📌 Endpoint do pobierania sugerowanych pytań na podstawie kroku formularza
app.get("/suggested-questions/:step/:field", (req, res) => {
  const step = parseInt(req.params.step, 10);
  const field = req.params.field.toLowerCase();

  console.log(`🔍 Otrzymano zapytanie: step=${step}, field=${field}`);
  console.log("📥 Wszystkie dostępne pola:", faqData.map(q => q.field));


  if (isNaN(step)) {
    return res.status(400).json({ error: "Nieprawidłowy numer kroku" });
  }

  // 🔹 Filtrujemy pytania według kroku formularza oraz frazy w pytaniu
  const filteredQuestions = faqData
    .filter((item) => item.step === step && item.field === field)
    .map((item) => item.question);

    console.log("📜 Pytania znalezione:", filteredQuestions);


  res.json({ questions: filteredQuestions || [] });
});

// 📌 Endpoint do pobierania pytań tylko po kroku (bez pola)
app.get("/suggested-questions/:step", (req, res) => {
  const step = parseInt(req.params.step, 10);

  if (isNaN(step)) {
    return res.status(400).json({ error: "Nieprawidłowy numer kroku" });
  }

  const filteredQuestions = faqData
    .filter((item) => item.step === step)
    .map((item) => item.question);

  res.json({ questions: filteredQuestions || [] });
});

// 📌 Endpoint `/chat` – obsługa zapytań użytkowników
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Brak wiadomości" });
  }

  // 📌 Szukamy najlepszego dopasowania w FAQ
  const questions = knowledgeBase.map((item) => item.question);
  const matches = similarity.findBestMatch(userMessage, questions);

  if (matches.bestMatch.rating > 0.65) {
    // ✅ Jeśli znaleziono odpowiedź w FAQ, zwracamy ją
    const matchedAnswer = knowledgeBase[matches.bestMatchIndex].answer;
    return res.json({ reply: matchedAnswer });
  }

  // 📌 Jeśli nie znaleziono odpowiedzi, wysyłamy do AI (DeepSeek API)
  try {
    const systemPrompt =
      "Jesteś przyjaznym asystentem pomagającym użytkownikom w uzyskaniu świadectw charakterystyki energetycznej. Odpowiadaj ciepło i sympatycznie, używając czasem emotikonów. Mozesz byc odrobine zabawny ale bez przesady aby nie zrazic uzytkownika chatu.";

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Błąd API: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Błąd podczas komunikacji z DeepSeek API:", error);
    res.status(500).json({ reply: "Błąd serwera." });
  }
});

// Uruchomienie serwera na porcie 5000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
