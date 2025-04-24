import { useEffect, useState } from "react";
import "./landing.scss";

export default function WizytowkaLanding() {
  const [ref, setRef] = useState("");
  const [isPartner, setIsPartner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharePlatform, setSharePlatform] = useState("whatsapp");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setRef(searchParams.get("ref") || "");
      setIsPartner(searchParams.get("partner") === "true");
    }
  }, []);

  const clientLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/wizytowka?ref=${ref}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(clientLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getShareUrl = () => {
    const encodedText = encodeURIComponent(
      `Dzień dobry!
      Przesyłam kontakt do sprawdzonego wykonawcy świadectwa energetycznego. Kliknij i wypełnij formularz: ${clientLink}`
    );
    switch (sharePlatform) {
      case "whatsapp":
        return `https://wa.me/?text=${encodedText}`;
      case "sms":
        return `sms:?body=${encodedText}`;
      case "messenger":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          clientLink
        )}`;
      default:
        return "#";
    }
  };

  return (
    <div className="wizytowka">
      <div className="ramka">
        <div className="wrapper">
          <div className="img_h1">
            <img src="/images/wizytowka_logo.png" alt="" />
            <h1>ŚWIADECTWO CHARAKTERYSTYKI ENERGETYCZNEJ</h1>
          </div>

          {isPartner ? (
            <>
              <div className="up">
                <p>
                  Szybkie i tanie świadectwo w 24h.
                </p>
                <div className="offer">
                  <strong className="strong">Płacę 50 zł</strong> <br />
                  za każde skuteczne polecenie* <br />
                </div>

                <div className="client">
                  {/* <h3>
                    **Udostępnij wizytówkę Twojemu Klientowi w:
                    <br />
                  </h3> */}

                  <div className="select_button">
                    <div className="custom-select">
                      <select
                        id="platform"
                        value={sharePlatform}
                        onChange={(e) => setSharePlatform(e.target.value)}
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="sms">SMS</option>
                        {/* <option value="messenger">Messenger</option> */}
                      </select>
                    </div>

                    <a
                      className="share-button"
                      href={getShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WYŚLIJ
                    </a>
                  </div>
                </div>
              </div>
              <div className="down">
                <div className="figcaption">
                  <span className="small">
                    *skuteczne polecenie to zlecenie zakończone płatnością
                    klienta.
                  </span>
                  <br />
                  <span className="small">
                    wszystkie informacje poufne zostaną ukryte
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="client_offer">
                Potrzebujesz świadectwa energetycznego do sprzedaży lub wynajmu
                nieruchomości? Wykonam je szybko i bez zbędnych formalności –
                gotowe nawet w 24h.
              </p>

              <button className="client_button">
                <a
                  href={`http://localhost:3000/form?ref=${ref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wypełnij <br />
                  formularz <br />
                  zgłoszenia
                </a>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
