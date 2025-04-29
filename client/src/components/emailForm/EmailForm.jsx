import React, { useEffect, useState } from "react";
import "./emailForm.scss";

const EmailForm = ({
  onClose,
  handleGenerateAndSendPDF,
  senderName: initialSenderName,
  propertyAddress: initialPropertyAddress,
  from: initialFrom,
}) => {
  const [from, setFrom] = useState(initialFrom || "");
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [senderName, setSenderName] = useState(initialSenderName || "");
  const [propertyAddress, setPropertyAddress] = useState(initialPropertyAddress || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Aktualizujemy stany, jeśli wartości początkowe ulegną zmianie
  useEffect(() => {
    setFrom(initialFrom || "");
    setSenderName(initialSenderName || "");
    setPropertyAddress(initialPropertyAddress || "");
  }, [initialFrom, initialSenderName, initialPropertyAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const message = `
      Dzień dobry,
      W imieniu Pani/Pana ${senderName}, zwracamy się z prośbą o pomoc w uzupełnieniu informacji dotyczących nieruchomości położonej przy ul. ${propertyAddress}.
      W załączonym pliku PDF znajdą Państwo pytania, na które odpowiedzi pozwolą nam sporządzić certyfikat. Będziemy wdzięczni za wypełnienie dokumentu i odesłanie go na maila ${from}.
    `;

    try {
      await handleGenerateAndSendPDF(from, to, message);
    } catch (err) {
      setError("Wystąpił błąd podczas wysyłania e-maila.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-form-popup lato-light">
      <form onSubmit={handleSubmit}>
        <label>
          <p className="lato-regular">Twoje Imię i nazwisko:</p>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
            placeholder="Imię i nazwisko nadawcy"
          />
        </label>
        <label>
        <p className="lato-regular">Adres nieruchomości:</p>
          <input
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            required
            placeholder="Adres nieruchomosci"
          />
        </label>
        <label>
        <p className="lato-regular">Od:</p>
          <input
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            placeholder="email nadawcy"
          />
        </label>
        <label>
        <p className="lato-regular">Do:</p>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            placeholder="email odbiorcy / zarządcy"
          />
        </label>
        <button type="submit" disabled={loading}>
          Wyślij
        </button>
        {error && <p>{error}</p>}
      </form>
      {/* <button onClick={onClose}>Anuluj</button> */}
    </div>
  );
};

export default EmailForm;