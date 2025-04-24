// conversationData.js

const formData = [
  {
    id: 1,
    question: "Czy masz ju u nas konto?",
    options: ["Tak", "Nie"],
    type: "choice", // Odpowiedź zamknięta
    
  },
  {
    id: 2,
    question: "Poznajmy się zatem. Jak masz na imię?",
    type: "text", // Odpowiedź otwarta
    inputs: [
      { fieldName: "imie", placeholder: "Imię" },
    ],
  },
  {
    id: 3,
    question: "Podaj proszę nazwisko",
    type: "text", // Odpowiedź otwarta
    inputs: [
      { fieldName: "nazwisko", placeholder: "Nazwisko" },
    ],
  },
  {
    id: 4,
    question:
      "Napisz proszę Twój email",
    type: "text", // Odpowiedź otwarta
    inputs: [
      { fieldName: "email", placeholder: "Adres e-mail" },
    ],
  },
  {
    id: 5,
    question: "Podaj proszę jeszcze Twój nume telefonu",
    type: "text", // Odpowiedź otwarta
  },
  {
    id: 6,
    question:
      "Dziękuję za podane dane. To",
    type: "text",
    inputs: [
      { placeholder: "Miasto", fieldName: "miasto" },
      { placeholder: "ulica, nr", fieldName: "ulica" },
    ],
  },
  {
    id: 7,
    question: "Jak jest powierzchnia uzytkowa [napisz powierzchnie w m2]",
    type: "text", // Odpowiedź otwarta
    questForOther: "Powierzchnia użytkowa nieruchomości [m2]"
  },
  {
    id: 8,
    question: "Jaka jest wysokość pomieszczeń? [cm]",
    type: "text", // Odpowiedź otwarta
    questForOther: "Jaka jest wysokość pomieszczeń? [cm]"
  },
  {
    id: 9,
    question:
      "Ile ścian zewnętrznych ma to mieszkanie. (Ściany zewnętrzne to te które stykają się z powietrzem)",
    type: "text", // Odpowiedź otwarta
    questForOther: "Ile ścian zewnętrznych ma to mieszkanie. (Ściany zewnętrzne to te które stykają się z powietrzem)"
  },
  {
    id: 10,
    question: "Podaj źródło ogrzewania nieruchomości",
    options: [
      "Nie znam odpowiedzi",
      "Sieć miejska",
      "Grzejniki elektryczne",
      "Kocioł na biomase",
      "Kocioł na ekogroszek",
      "Kocioł węglowy",
      "Kocioł olejowy",
      "Kocioł gazowy w mieszkaniu",
      "Kocioł gazowy w kotłowni",
      "Kocioł gazowy w kotłowni zewnętrznej",
      "Energia geotermalna",
      "Piec kaflowy",
    ],
    type: "choice", // Odpowiedź zamknięta
  },
  {
    id: 11,
    question: "Wybierz z dostpępnych opcji źródło ciepłej wody",
    options: [
      "Nie znam odpowiedzi",
      "Sieć miejska",
      "Elektryczny podgrzewacz akumulacyjny",
      "lektryczny podgrzewacz przepływowy",
      "Kocioł na biomase",
      "Kocioł na ekogroszek",
      "Kocioł węglowy",
      "Kocioł olejowy",
      "Kocioł gazowy w mieszkaniu",
      "Kocioł gazowy w kotłowni",
      "Kocioł gazowy w kotłowni zewnętrznej",
      "Energia geotermalna",
    ],
    type: "choice", // Odpowiedź zamknięta
  },
  // {
  //   id: 12,
  //   question: "Wybierz rodziaj grzejników",
  //   options: [
  //     "Płytowe",
  //     "Zeliwne",
  //     "Członowe",
  //     "Podłogowe",
  //     "Ogrzewanie piecowe lub kominkowe",
  //   ],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 13,
  //   question: "Wybierz rodziaj wentylacji",
  //   options: [
  //     "Nie znam odpowiedzi",
  //     "Grawitacyjna",
  //     "Mechaniczna wywiewna",
  //     "Mechaniczna wywiewno-nawiewna",
  //   ],
  //   type: "choice", // Odpowiedź zamknięta
  // },

  // {
  //   id: 14,
  //   question: "Liczba szyb w oknach. Wpisz 0 jeśli nie znasz odpowiedzi",
  //   type: "text", // Odpowiedź otwarta
  // },
  // {
  //   id: 15,
  //   question: "Materiał ścian zewnętrznych",
  //   options: [
  //     "Nie znam odpowiedzi",
  //     "Beton komórkowy",
  //     "Ytong",
  //     "Cegła",
  //     "Silka",
  //     "Porotherm",
  //     "Żelbet",
  //     "Drewno",
  //     "Pustak żużlowy",
  //   ],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 16,
  //   question: "Grubość ściany zewnętrznej. Wpisz 0 jeśli nie znasz odpowiedzi",
  //   type: "text", // Odpowiedź otwarta
  // },
  // {
  //   id: 17,
  //   question: "Materiał izolacji ściany zewnętrznej",
  //   options: [
  //     "Nie znam odpowiedzi",
  //     "Styropian biały",
  //     "Styropian grafitowy",
  //     "Wełna mineralna",
  //     "Piana poliuretanowa",
  //     "Brak izolacji",
  //   ],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 18,
  //   question: "Grubość materiału izolacyjnego. Wpisz 0 jeśli nie znasz odpowiedzi",
  //   type: "text", // Odpowiedź otwarta
  // },
  // {
  //   id: 19,
  //   question: "Rok oddania budynku do uytkowania. Wpisz 0 jeśli nie znasz odpowiedzi",
  //   type: "text", // Odpowiedź otwarta
  // },
  // {
  //   id: 20,
  //   question: "Rok ostatniej termomodernizacji. Wpisz 0 jeśli nie znasz odpowiedzi",
  //   type: "text", // Odpowiedź otwarta
  // },
  // {
  //   id: 21,
  //   question: "Czy nieruchomość posiada klimatyzację?",
  //   options: ["Tak", "Nie"],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 22,
  //   question: "Czy nieruchomość posiada fotowoltaikę?",
  //   options: ["Tak", "Nie"],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 23,
  //   question: "Czy nieruchomość posiada taras lub balkon?",
  //   options: ["Tak", "Nie"],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 24,
  //   question: "Czy mieszkanie jest na parterze?",
  //   options: ["Tak", "Nie"],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 25,
  //   question: "Czy mieszkanie znajduje się na ostatnim piętrze?",
  //   options: ["Tak", "Nie"],
  //   type: "choice", // Odpowiedź zamknięta
  // },
  // {
  //   id: 26,
  //   question: "Na tym zakończyliśmy. Dziękuje za poświęcony czas. Jeśli masz jeszcze jakieś uwagi lub wiedzę na temat nietypowych cech budynku, które mogą wpływać na parametry cieplne nieruchomości to tutaj wpisz te informacje.",
  //   type: "text", // Odpowiedź otwarta
  // },
  // {
  //   id: 27,
  //   question: "Do wykonania świadectwa potrzebujemy równie zdjecia budynku z zewnątrz oraz rzut neiruchomoci. Po skompletowaniu wszystkich odpowiedzi na pytania z formularza wyswitli się okienko które pozwoi Ci załączyć  rysunki w formie pdf lub innym formacie graficznyym. Przygotuj te grafiki. Rzut moze być szkicem ołówkiem. Czy posiadasz te grafiki już teraz ter  ",
  //   options: ["Tak", "Nie"],
  //   type: "choice", // Odpowiedź zamknięta
  // },
];

export default formData;
