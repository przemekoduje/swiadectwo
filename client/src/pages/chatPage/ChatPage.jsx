import React, { useState, useEffect, useRef } from "react";
import "./chatPage.scss";
import Typewriter from "typewriter-effect";
import formData from "../../components/formData";
import jsPDF from "jspdf";
import EmailForm from "../../components/emailForm/EmailForm";
import AvatarButton from "../../components/avatarButton/AvatarButton";
import FileUploader from "../../components/fileUploader/FileUploader";
import axios from 'axios';

export default function ChatPage() {
  const [showChat, setShowChat] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [conversation, setConversation] = useState([]); // Przechowywanie całej rozmowy
  const [headPhotoHidden, setHeadPhotoHidden] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Indeks aktualnego pytania
  const [userInputs, setUserInputs] = useState({}); // Przechowywanie wartości wprowadzonych przez użytkownika
  const [userInputVisible, setUserInputVisible] = useState(false); // Kontrola pola tekstowego
  const [botTyping, setBotTyping] = useState(false); // Kontrola, czy bot pisze
  const [scrollOffset, setScrollOffset] = useState(0); // Stan przesunięcia do góry
  const lastMessageRef = useRef(null); // Referencja do ostatniej wiadomości

  const [editMode, setEditMode] = useState(false); // Czy edycja jest aktywna
  const [editIndex, setEditIndex] = useState(null); // Indeks pytania, które jest edytowane
  const userInputRef = useRef(null);
  const [skippedQuestions, setSkippedQuestions] = useState([]); // Lista pytań pominiętych
  const [showEmailForm, setShowEmailForm] = useState(false);
  const chatContainerRef = useRef(null); // Dodaj ref
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Flaga do śledzenia ręcznego przewijania
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({
    exteriorPhoto: null,
    propertyLayout: null,
    additionalPhoto: null,
  });

  useEffect(() => {
    // Funkcja pomocnicza do pobierania odpowiedzi
    const getResponse = () => {
      const userMessages = document.querySelectorAll(".chat-user-message p");
      let responses = [];

      userMessages.forEach((msg) => {
        responses.push(msg.textContent); // Pobieranie treści <p>
      });

      return responses; // Zwracamy tablicę odpowiedzi użytkownika
    };

    // Pobierz tablicę odpowiedzi użytkownika
    const responses = getResponse();

    // Ustal indeksy pytań w formData
    const nameIndex = 1; // Indeks pytania o imię
    const surnameIndex = 2; // Indeks pytania o nazwisko
    const emailIndex = 3; // Indeks pytania o email
    const addressIndex = 5; // Indeks pytania o adres (miasto i ulica)

    // Wyciągnij odpowiedzi z tablicy 'responses' na podstawie indeksów
    // Ustaw wartości w stanach
    setName(responses[nameIndex] || "");
    setSurname(responses[surnameIndex] || "");
    setEmail(responses[emailIndex] || "");
    setAddress(responses[addressIndex] || "");
  }, [currentQuestionIndex]); // Wywołanie, gdy zmieni się currentQuestionIndex

  // Dodane: Sprawdzenie czy użytkownik jest powracający
  useEffect(() => {
    const userVisitedBefore = localStorage.getItem("userVisitedBefore");
    if (userVisitedBefore) {
      setIsReturningUser(true);
    } else {
      localStorage.setItem("userVisitedBefore", "true");
    }
  }, []);

  const typeSpeed = 150; // Prędkość pisania bota w ms

  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleCloseEmailForm = () => {
    setShowEmailForm(false);
  };

  const handleNextClick = () => {
    setShowChat(true);
    setTimeout(() => {
      setChatVisible(true);
    }, 800); // Czas na animację zdjęcia bota
  };

  // Funkcja do śledzenia, czy użytkownik przewija ręcznie
  const handleScroll = () => {
    setIsUserScrolling(true);
    const chatContainer = chatContainerRef.current;
    const scrollTop = chatContainer.scrollTop;
    const clientHeight = chatContainer.clientHeight;
    const scrollHeight = chatContainer.scrollHeight;

    console.log("scrollTop:", scrollTop);
    console.log("clientHeight:", clientHeight);
    console.log("scrollHeight:", scrollHeight);

    if (scrollTop + clientHeight < scrollHeight - 50) {
      console.log("Użytkownik przewija ręcznie. Nie jesteśmy na dole czatu.");
    } else {
      console.log("Użytkownik znajduje się blisko lub na dole czatu.");
    }

    // if (
    //   chatContainer.scrollTop + chatContainer.clientHeight <
    //   chatContainer.scrollHeight + 10
    // ) {
    //   setIsUserScrolling(true);
    // } else {
    //   setIsUserScrolling(false);
    // }
  };

  useEffect(() => {
    // Sprawdzamy, czy istnieją dane rozmowy w localStorage
    const savedConversation = localStorage.getItem("conversation");
    const savedQuestionIndex = localStorage.getItem("currentQuestionIndex");

    if (savedConversation) {
      setConversation(JSON.parse(savedConversation));
    }

    if (savedQuestionIndex) {
      setCurrentQuestionIndex(JSON.parse(savedQuestionIndex));
    }
  }, []); // Wywołanie tylko raz przy załadowaniu strony

  useEffect(() => {
    if (userInputVisible) {
      console.log("userInput is visible", userInputVisible);
      // Znajdujemy najbliższą wiadomość bota (ostatnią przed user-input-container)
      const chatContainer = chatContainerRef.current;
      const botMessages = chatContainer.querySelectorAll(".chat-bot-message");
      const userMessages = chatContainer.querySelectorAll(".chat-user-message");
      const lastBotMessage = botMessages[botMessages.length - 1];

      const wrapContainer = document.querySelector(".wrapContainer"); // wrapContainer
      const wrapContainerRect = wrapContainer.getBoundingClientRect();

      // Znajdujemy drugą od końca wiadomość bota i użytkownika
      const secondLastBotMessage =
        botMessages.length > 1 ? botMessages[botMessages.length - 2] : null;
      const secondLastUserMessage =
        userMessages.length > 1 ? userMessages[userMessages.length - 2] : null;

      if (lastBotMessage) {
        // Pobierz pozycję wiadomości bota względem chatContainer
        const botMessageRect = lastBotMessage.getBoundingClientRect();

        console.log(botMessageRect);
        console.log(wrapContainerRect);

        // Oblicz różnicę między pozycją wiadomości a pozycją 220px od góry wrapContainer
        const currentOffset = botMessageRect.top - wrapContainerRect.top;
        const targetOffset = 220; // docelowa pozycja 220px od górnej krawędzi

        let scrollAmount = currentOffset - targetOffset;

        // Jeśli istnieje druga od końca wiadomość bota, dodaj jej wysokość
        if (secondLastBotMessage) {
          const pElementBot = secondLastBotMessage.querySelector("p"); // Znajduje <p> w secondLastBotMessage
          if (pElementBot) {
            console.log(
              "Tekst w secondLastBotMessage:",
              pElementBot.textContent
            ); // Wyświetla tekst
          }
          const secondBotMessageHeight =
            secondLastBotMessage.getBoundingClientRect().height;
          scrollAmount += secondBotMessageHeight;
        }

        // Jeśli istnieje druga od końca wiadomość użytkownika, dodaj jej wysokość
        if (secondLastUserMessage) {
          const pElementUser = secondLastUserMessage.querySelector("p"); // Znajduje <p> w secondLastUserMessage
          if (pElementUser) {
            console.log(
              "Tekst w secondLastUserMessage:",
              pElementUser.textContent
            ); // Wyświetla tekst
          }
          const secondUserMessageHeight =
            secondLastUserMessage.getBoundingClientRect().height;
          scrollAmount += secondUserMessageHeight;
        }

        console.log(scrollAmount);

        // Pobierz aktualny styl top
        const currentTop =
          parseInt(window.getComputedStyle(chatContainer).top, 10) || 0;
        const newTop = currentTop - scrollAmount; // Oblicz nową wartość top

        // Ustaw nową wartość top
        chatContainer.style.top = `${newTop}px`;
        console.log("Przesuwanie chatContainer, nowa wartość top:", newTop);
      }
    }
  }, [userInputVisible]);

  const calculateScrollOffset = () => {
    if (lastMessageRef.current) {
      const lastMessageHeight = lastMessageRef.current.offsetHeight;
      setScrollOffset((prevOffset) => prevOffset + lastMessageHeight);
    }
  };

  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        setHeadPhotoHidden(true);
      }, 2000);
    }
  }, [showChat]);

  const typeBotMessage = (text, id) => {
    setBotTyping(true);

    const isQuestionAlreadyAdded = conversation.some(
      (message) => message.type === "bot" && message.text === text
    );

    if (!isQuestionAlreadyAdded) {
      const typingDuration = text.length * typeSpeed + 500;

      setTimeout(() => {
        setConversation((prevConversation) => [
          ...prevConversation,
          { type: "bot", text: text, id: id }, // Dodajemy id do wiadomości bota
        ]);

        setBotTyping(false);

        setTimeout(() => {
          setUserInputVisible(true);
        }, 1000);

        calculateScrollOffset();
      }, typingDuration);
    }
  };

  useEffect(() => {
    if (chatVisible && currentQuestionIndex < formData.length) {
      setUserInputVisible(false);
      const currentQuestion = formData[currentQuestionIndex];

      if (currentQuestion.type === "text") {
        typeBotMessage(currentQuestion.question, currentQuestion.id);
      } else if (currentQuestion.type === "choice") {
        typeBotMessage(currentQuestion.question, currentQuestion.id);
      }
    }
  }, [currentQuestionIndex, chatVisible]);

  const handleInputChange = (e, fieldName) => {
    console.log("Field name:", fieldName, "Value:", e.target.value);
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [fieldName]: e.target.value,
    }));

    console.log("Zmiana wartości dla:", fieldName, "na", e.target.value);
  };

  useEffect(() => {
    // Sprawdzamy, czy wszystkie pytania zostały odpowiedziane
    if (currentQuestionIndex >= formData.length) {
      console.log("Wszystkie pytania zakończone, pokaż skippedQuestions");
    }
  }, [currentQuestionIndex, formData.length]);

  const handleInputSubmit = (event) => {
    if (event.key === "Enter") {

      console.log("Przed zapisem userInputs:", userInputs);
      const currentQuestion = formData[currentQuestionIndex];

      const userResponse = {
        type: "user",
        text:
          Array.isArray(currentQuestion.inputs) &&
          currentQuestion.inputs.length > 1
            ? `${userInputs[currentQuestion.inputs[0].fieldName] || ""}, ${
                userInputs[currentQuestion.inputs[1].fieldName] || ""
              }`
            : userInputs[
                currentQuestion.inputs?.[0]?.fieldName || "singleInput"
              ] || "",
        id: currentQuestion.id,
      };

      const shouldSkip =
        userResponse.text === "0" ||
        ["Nie", "Nie wiem", "Nie znam odpowiedzi"].includes(userResponse.text);

      console.log(shouldSkip);
      // Natychmiastowa aktualizacja stanu
      setSkippedQuestions((prevSkipped) => {
        if (shouldSkip && !prevSkipped.includes(currentQuestion.question)) {
          return [...prevSkipped, currentQuestion.question]; // Dodajemy pytanie do listy
        } else if (
          !shouldSkip &&
          prevSkipped.includes(currentQuestion.question)
        ) {
          return prevSkipped.filter((q) => q !== currentQuestion.question); // Usuwamy pytanie z listy
        }
        return prevSkipped;
      });

      // Zapisz odpowiedzi
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation, userResponse];
        localStorage.setItem(
          "conversation",
          JSON.stringify(updatedConversation)
        );
        localStorage.setItem("currentQuestionIndex", currentQuestionIndex + 1);
        return updatedConversation;
      });

      // Zmiana currentQuestionIndex
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        localStorage.setItem("currentQuestionIndex", newIndex);
        return newIndex;
      });

      // Usuwanie tylko danych dla bieżącego pytania, zamiast resetować wszystkie dane
      setUserInputs((prevInputs) => {
        const updatedInputs = { ...prevInputs };
        if (Array.isArray(currentQuestion.inputs)) {
          currentQuestion.inputs.forEach((input) => {
            delete updatedInputs[input.fieldName];
          });
        } else {
          delete updatedInputs.singleInput;
        }
        return updatedInputs;
      });

      setUserInputVisible(false);

      if (currentQuestionIndex < formData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log("Koniec pytań. Rozmowa zakończona.");
      }

      calculateScrollOffset();
    }
  };

  const handleOptionClick = (option) => {
    const currentQuestion = formData[currentQuestionIndex];

    const userResponse = {
      type: "user",
      text: option,
      id: currentQuestion.id,
    };

    const shouldSkip = ["Nie", "Nie wiem", "Nie znam odpowiedzi"].includes(
      option
    );

    setSkippedQuestions((prevSkipped) => {
      if (shouldSkip && !prevSkipped.includes(currentQuestion.question)) {
        return [...prevSkipped, currentQuestion.question]; // Dodajemy pytanie do listy
      } else if (
        !shouldSkip &&
        prevSkipped.includes(currentQuestion.question)
      ) {
        return prevSkipped.filter((q) => q !== currentQuestion.question); // Usuwamy pytanie z listy
      }
      return prevSkipped;
    });

    setConversation((prevConversation) => {
      const updatedConversation = [...prevConversation, userResponse];
      localStorage.setItem("conversation", JSON.stringify(updatedConversation));
      localStorage.setItem("currentQuestionIndex", currentQuestionIndex + 1);
      return updatedConversation;
    });

    // Zmiana currentQuestionIndex
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      localStorage.setItem("currentQuestionIndex", newIndex); // Zapis do localStorage
      return newIndex;
    });

    setUserInputVisible(false);

    if (currentQuestionIndex < formData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Koniec pytań. Rozmowa zakończona.");
    }

    calculateScrollOffset();
  };

  const handleAutoResponse = () => {
    const currentQuestion = formData[currentQuestionIndex];

    // Tworzymy automatyczną odpowiedź
    const userResponse = {
      type: "user",
      text: "Nie znam odpowiedzi",
      id: currentQuestion.id,
    };

    // Sprawdzenie, czy odpowiedź powinna być pominięta
    const shouldSkip = ["Nie", "Nie wiem", "Nie znam odpowiedzi"].includes(
      userResponse.text
    );
    // Aktualizacja listy pytań pominiętych
    setSkippedQuestions((prevSkipped) => {
      if (shouldSkip && !prevSkipped.includes(currentQuestion.question)) {
        return [...prevSkipped, currentQuestion.question]; // Dodajemy pytanie do listy pominiętych
      }
      return prevSkipped;
    });

    // Aktualizujemy stan rozmowy
    setConversation((prevConversation) => {
      const updatedConversation = [...prevConversation, userResponse];
      localStorage.setItem("conversation", JSON.stringify(updatedConversation));
      localStorage.setItem("currentQuestionIndex", currentQuestionIndex + 1);
      return updatedConversation;
    });

    // Zwiększamy indeks pytania
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      localStorage.setItem("currentQuestionIndex", newIndex);
      return newIndex;
    });

    // Ukryjemy input po automatycznej odpowiedzi
    setUserInputVisible(false);
  };

  const handleEdit = (id) => {
    setEditMode(true);
    setEditIndex(id);

    const userMessage = conversation.find(
      (msg) => msg.type === "user" && msg.id === id
    );

    if (userMessage) {
      setUserInputs({ singleInput: userMessage.text });
    }
  };

  const handleSaveEdit = (id) => {
    setConversation((prevConversation) => {
      const updatedConversation = prevConversation.map((msg) =>
        msg.id === id && msg.type === "user"
          ? { ...msg, text: userInputs.singleInput }
          : msg
      );

      const currentQuestion = formData.find((q) => q.id === id);

      // Warunki, które kwalifikują pytanie do listy pytań pominiętych
      const shouldSkip =
        userInputs.singleInput === "0" ||
        ["Nie", "Nie wiem", "Nie znam odpowiedzi"].includes(
          userInputs.singleInput
        );

      setSkippedQuestions((prevSkipped) => {
        let updatedSkippedQuestions;

        if (shouldSkip && !prevSkipped.includes(currentQuestion.question)) {
          // Dodanie pytania na listę, jeśli powinno być pominięte
          updatedSkippedQuestions = [...prevSkipped, currentQuestion.question];
        } else if (
          !shouldSkip &&
          prevSkipped.includes(currentQuestion.question)
        ) {
          // Usunięcie pytania z listy, jeśli nie powinno być pominięte
          updatedSkippedQuestions = prevSkipped.filter(
            (question) => question !== currentQuestion.question
          );
        } else {
          updatedSkippedQuestions = prevSkipped;
        }

        return updatedSkippedQuestions; // Tylko aktualizacja stanu
      });

      // Zapisanie zaktualizowanej rozmowy do localStorage
      localStorage.setItem("conversation", JSON.stringify(updatedConversation));

      return updatedConversation;
    });

    setEditMode(false);
    setEditIndex(null);
    // setUserInputs({});
  };

  useEffect(() => {
    // Sprawdzamy, czy istnieją dane rozmowy i lista pytań pominiętych w localStorage
    const savedConversation = localStorage.getItem("conversation");
    const savedQuestionIndex = localStorage.getItem("currentQuestionIndex");
    const savedSkippedQuestions = localStorage.getItem("skippedQuestions");

    if (savedConversation) {
      setConversation(JSON.parse(savedConversation));
    }

    if (savedQuestionIndex) {
      setCurrentQuestionIndex(JSON.parse(savedQuestionIndex));
    }

    if (savedSkippedQuestions) {
      setSkippedQuestions(JSON.parse(savedSkippedQuestions)); // Przywracamy listę pytań pominiętych
    }
  }, []); // Wywołanie tylko raz przy załadowaniu strony

  useEffect(() => {
    // Zapisujemy listę pytań pominiętych do localStorage, jeśli się zmienia
    if (skippedQuestions && skippedQuestions.length > 0) {
      localStorage.setItem(
        "skippedQuestions",
        JSON.stringify(skippedQuestions)
      );
    }
  }, [skippedQuestions]);

  const generatePDF = async (skippedQuestions) => {
    const doc = new jsPDF();

    // Pobierz czcionkę Roboto w formacie .ttf
    const response = await fetch("/fonts/Roboto-Regular.ttf");
    const fontBlob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = function () {
        const base64Font = reader.result.split(",")[1];

        // Dodaj czcionkę do jsPDF
        doc.addFileToVFS("Roboto-Regular.ttf", base64Font);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");

        // Ustaw rozmiar czcionki
        doc.setFontSize(14);

        // Dodaj tekst do dokumentu
        doc.text("Lista pytań", 20, 20);

        let yOffset = 30;
        // skippedQuestions.forEach((question, index) => {
        //   doc.text(`${index + 1}. ${question}`, 20, yOffset);
        //   yOffset += 10;
        // });

        skippedQuestions.forEach((skippedQuestion, index) => {
          const formQuestion = formData.find(
            (q) => q.question === skippedQuestion
          );

          // Zwiększenie przesunięcia dla pytania
          yOffset += 10;

          // Dodaj pytanie
          doc.text(
            `${index + 1}. ${formQuestion?.questForOther || skippedQuestion}`,
            20,
            yOffset
          );

          // Sprawdź, czy pytanie ma opcje wyboru i dodaj je z odstępami
          if (formQuestion?.options) {
            formQuestion.options.forEach((option, optionIndex) => {
              yOffset += 8; // Dodaj odstęp między opcjami
              doc.text(`- ${option}`, 30, yOffset); // Opcje są wcięte
            });
          }

          // Jeżeli miejsce na stronie się skończy, dodaj nową stronę
          if (yOffset > 280) {
            doc.addPage();
            yOffset = 20; // Resetuj yOffset na nowej stronie
          }
        });

        // Generuj PDF jako Blob
        const pdfBlob = doc.output("blob");
        resolve(pdfBlob);
      };

      reader.onerror = function () {
        reject(new Error("Błąd odczytu pliku czcionki"));
      };

      reader.readAsDataURL(fontBlob); // Odczytaj czcionkę jako Base64
    });
  };

  const sendPDFToBackend = async (pdfBlob) => {
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "pytaniaChat.pdf");

    try {
      const response = await fetch("http://localhost:3001/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("PDF został pomyślnie wysłany na backend.");
      } else {
        console.error("Błąd podczas wysyłania PDF na backend.");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const handleGenerateAndSendPDF = async (from, to, note) => {
    try {
      const pdfBlob = await generatePDF(skippedQuestions);
      await sendPDFToBackend(pdfBlob);

      // Wyślij e-mail po wygenerowaniu PDF
      await fetch("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          note,
        }),
      });

      alert("PDF wygenerowany i wysłany na maila.");
      setShowEmailForm(false); // Zamknięcie formularza po wysłaniu
    } catch (error) {
      console.error("Błąd podczas generowania lub wysyłania PDF:", error);
    }
  };

  const handleFileSelect = (file, fieldName) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [fieldName]: file,
    }));
    console.log("Wybrano plik:", file);
  };

  // Funkcja do zebrania wszystkich pytań i odpowiedzi
  const prepareConversationData = () => {
    // Tworzymy pustą tablicę, która przechowa wszystkie pytania i odpowiedzi
    let conversationData = [];
    
    // Przechodzimy przez conversation
    for (let i = 0; i < conversation.length; i++) {
      const message = conversation[i];
      
      // Jeśli wiadomość pochodzi od bota (pytanie)
      if (message.type === "bot") {
        // Znajdujemy kolejną wiadomość od użytkownika, która jest odpowiedzią na to pytanie
        const userResponse = conversation[i + 1] && conversation[i + 1].type === "user"
          ? conversation[i + 1].text
          : "Brak odpowiedzi";
  
        // Dodajemy parę pytanie-odpowiedź do tablicy conversationData
        conversationData.push({
          question: message.text, // Pytanie bota
          answer: userResponse // Odpowiedź użytkownika
        });
      }
    }
  
    console.log("Otrzymano dane rozmowy:", conversationData);
    return conversationData;
  };
  

  console.log(conversation)
  console.log(userInputs)



  const sendConversationToBackend = async () => {
    const conversationData = prepareConversationData();
    const formData = new FormData();
  
    formData.append("userAnswers", JSON.stringify(conversationData));
  
    if (uploadedFiles.exteriorPhoto) {
      console.log("Wybrany plik exteriorPhoto:", uploadedFiles.exteriorPhoto);
      formData.append("exteriorPhoto", uploadedFiles.exteriorPhoto);
    }
  
    if (uploadedFiles.propertyLayout) {
      console.log("Wybrany plik propertyLayout:", uploadedFiles.propertyLayout);
      formData.append("propertyLayout", uploadedFiles.propertyLayout);
    }
  
    if (uploadedFiles.additionalPhoto) {
      console.log("Wybrany plik additionalPhoto:", uploadedFiles.additionalPhoto);
      formData.append("additionalPhoto", uploadedFiles.additionalPhoto);
    }

    // Zalogowanie zawartości FormData przed wysłaniem
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  
    try {
      const response = await axios.post('http://localhost:3001/api/send-form-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Dane zostały pomyślnie wysłane!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Błąd podczas wysyłania danych.");
      }
    } catch (error) {
      console.error("Błąd wysyłania danych:", error);
      alert("Wystąpił błąd podczas wysyłania danych.");
    }
  };


  // const sendConversationToBackend = async () => {
  //   // Przygotowanie danych rozmowy (same dane bez plików)
  //   const conversationData = prepareConversationData();
  
  //   try {
  //     // Wysyłanie danych na backend
  //     const response = await fetch("http://localhost:3001/api/send-data-email", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userAnswers: conversationData,
  //       }),
  //     });
  
  //     if (response.ok) {
  //       alert("Dane zostały pomyślnie wysłane na e-mail!");
  //     } else {
  //       const errorData = await response.json();
  //       alert(errorData.message || "Błąd podczas wysyłania danych.");
  //     }
  //   } catch (error) {
  //     console.error("Błąd wysyłania danych:", error);
  //     alert("Wystąpił błąd podczas wysyłania danych.");
  //   }
  // };
  
  

  

  return (
    <div className="chatpage">
      <div className="chatback">
        <img src="/images/design7_1.png" alt="Background" />
      </div>

      <div className="wrapContainer">
        <div
          className={`headPhoto ${showChat ? "headPhoto-chat" : ""} ${
            headPhotoHidden ? "hidden" : ""
          }`}
        >
          <img src="/images/profil.jpg" alt="Profile" />
        </div>
        <hr className="full-width-line" />

        {/* Wyświetlanie różnych powitań w zależności od nowego/powracającego użytkownika */}
        <div
          className={`infoContainer ${showChat ? "infoContainer-hide" : ""}`}
        >
          {isReturningUser ? (
            <span>
              Witamy ponownie! Cieszymy się, że wróciłeś do naszej aplikacji.
              Możemy kontynuować, gdzie skończyłeś.
            </span>
          ) : (
            <span>
              Witamy w naszej aplikacji! Zacznij swoją podróż, odpowiadając na
              kilka pytań.
            </span>
          )}
          <button onClick={handleNextClick}>Dalej</button>
        </div>

        {chatVisible && (
          <>
            <div
              className="chatContainer chat-visible"
              style={{ transform: `translateY(-${scrollOffset}px)` }}
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              {conversation.map((message, index) => (
                <div
                  className={`chat-message ${
                    message.type === "bot"
                      ? "chat-bot-message"
                      : "chat-user-message"
                  }`}
                  ref={
                    index === conversation.length - 1 ? lastMessageRef : null
                  }
                >
                  {message.type === "bot" ? (
                    <>
                      <div className="bot-avatar">
                        <img src="/images/profil.jpg" alt="Bot Avatar" />
                      </div>
                      <p className="lato-light">{message.text}</p>
                    </>
                  ) : (
                    <>
                      {editMode && editIndex === message.id ? (
                        <input
                          type="text"
                          value={userInputs.singleInput || ""}
                          onChange={(e) =>
                            setUserInputs({ singleInput: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(message.id);
                            }
                          }}
                        />
                      ) : (
                        <p className="lato-light">{message.text}</p>
                      )}
                      {message.type === "user" && (
                        <div className="user-avatar">
                          <button onClick={() => handleEdit(message.id)}>
                            <img src="/images/account.png" alt="User Avatar" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {currentQuestionIndex >= formData.length &&
                (skippedQuestions.length > 0 ? (
                  <>
                    <div className="chat-bot-message">
                      <div className="head-summary">
                        <div className="bot-avatar">
                          <img src="/images/profil.jpg" alt="Bot Avatar" />
                        </div>
                        <p className="lato-light">
                          Dziękuję za poświęcony czas. Oto lista pytań do
                          zarządcy:
                        </p>
                      </div>
                    </div>

                    <div className="summary">
                      <button
                        onClick={async () => {
                          const pdfBlob = await generatePDF(skippedQuestions);
                          const pdfUrl = URL.createObjectURL(pdfBlob);
                          window.open(pdfUrl, "_blank");
                        }}
                      >
                        Otwórz PDF
                      </button>

                      <p
                        className="form lato-light"
                        style={{ marginTop: "15px" }}
                      >
                        Uzupełnij ponisze dane i wyślij plik pdf z pytaniami do Zarządcy.
                      </p>

                      {/* Sprawdzenie wartości przekazywanych do EmailForm */}
                      {console.log("Dane przekazywane do EmailForm:", {
                        senderName: `${userInputs["imie"] || ""} ${
                          userInputs["nazwisko"] || ""
                        }`,
                        propertyAddress: `${userInputs["miasto"] || ""}, ${
                          userInputs["ulica"] || ""
                        }`,
                        from: userInputs["email"] || "",
                      })}
                      {/* Wyświetlamy formularz EmailForm */}
                      <EmailForm
                        onClose={handleCloseEmailForm}
                        handleGenerateAndSendPDF={handleGenerateAndSendPDF}
                        senderName={`${name} ${surname}`}
                        propertyAddress={address}
                        from={email}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="chat-bot-message">
                      <div className="bot-avatar">
                        <img src="/images/profil.jpg" alt="Bot Avatar" />
                      </div>
                      <p className="lato-regular">
                        Dziękujemy za wypełnienie ankiety oraz poświęcony czas.
                      </p>
                    </div>
                    <div className="summary">
                      <p className="lato-regular">
                        Prześlij dodatkowe zdjęcia:
                      </p>

                      {/* Przykładowe przyciski do uploadu zdjęć */}
                      <div className="summary-buttons">
                        <FileUploader
                          label="Zdjęcie nieruchomości z zewnątrz"
                          onFileSelect={(file) =>
                            handleFileSelect(file, "exteriorPhoto")
                          }
                        />
                        <FileUploader
                          label="Rzut nieruchomości"
                          onFileSelect={(file) =>
                            handleFileSelect(file, "propertyLayout")
                          }
                        />
                        <FileUploader
                          label="Dodatkowe zdjęcie"
                          onFileSelect={(file) =>
                            handleFileSelect(file, "additionalPhoto")
                          }
                        />
                      </div>

                      {/* Przycisk Wyslij - funkcjonalność dodamy w następnym etapie */}
                      <p></p>
                      <button className="send" onClick={sendConversationToBackend}>
                        Wyślij
                      </button>
                    </div>
                  </>
                ))}

              {/* {currentQuestionIndex >= formData.length &&
                skippedQuestions.length > 0 && (
                  <div className="skipped-questions">
                    <h3>Lista pytań pominiętych:</h3>
                    <ul>
                      {skippedQuestions.map((skippedQuestion, index) => {
                        // Znajdujemy odpowiednie pytanie w formData
                        const formQuestion = formData.find(
                          (q) => q.question === skippedQuestion
                        );

                        return (
                          <li key={index}>
                            <strong>
                              {formQuestion?.questForOther || skippedQuestion}
                            </strong>
                            {formQuestion?.options && (
                              <ul>
                                {formQuestion.options.map((option, i) => (
                                  <li key={i}>{option}</li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <button onClick={handleShowEmailForm}>
                      Generuj i Wyślij PDF do zarządcy
                    </button>
                  </div>
                )}
              {showEmailForm && (
                <EmailForm
                  onClose={handleCloseEmailForm}
                  handleGenerateAndSendPDF={handleGenerateAndSendPDF}
                />
              )} */}

              {botTyping && (
                <div className="chat-bot-message">
                  <div className="bot-avatar">
                    <img src="/images/profil.jpg" alt="Bot Avatar" />
                  </div>
                  <div className="typing-text lato-light">
                    <Typewriter
                      options={{
                        strings: [formData[currentQuestionIndex].question],
                        autoStart: true,
                        delay: typeSpeed,
                        cursor: " ",
                      }}
                    />
                  </div>
                </div>
              )}

              {userInputVisible && !editMode && (
                <div className="user-input-container" ref={userInputRef}>
                  {formData[currentQuestionIndex].type === "choice" ? (
                    <div
                      className={`choice-container ${
                        currentQuestionIndex === 0
                          ? "row-layout"
                          : "column-layout"
                      }`}
                    >
                      {Array.isArray(formData[currentQuestionIndex].options) &&
                        formData[currentQuestionIndex].options.map(
                          (option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className="lato-light"
                            >
                              {option}
                            </button>
                          )
                        )}
                    </div>
                  ) : (
                    <div className="chat-user-message">
                      {formData[currentQuestionIndex].inputs &&
                      Array.isArray(formData[currentQuestionIndex].inputs) ? (
                        formData[currentQuestionIndex].inputs.map(
                          (input, i) => (
                            <input
                              key={i}
                              type="text"
                              className={`user-input ${
                                formData[currentQuestionIndex].inputs.length ===
                                1
                                  ? "full-width"
                                  : "half-width"
                              }`}
                              placeholder={input.placeholder}
                              value={userInputs[input.fieldName] || ""}
                              onChange={(e) =>
                                handleInputChange(e, input.fieldName)
                              }
                              onKeyDown={handleInputSubmit}
                            />
                          )
                        )
                      ) : (
                        <input
                          type="text"
                          className="user-input full-width"
                          placeholder="Your response..."
                          value={userInputs.singleInput || ""}
                          onChange={(e) =>
                            setUserInputs({ singleInput: e.target.value })
                          }
                          onKeyDown={handleInputSubmit}
                        />
                      )}
                      <AvatarButton onAutoResponse={handleAutoResponse} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}