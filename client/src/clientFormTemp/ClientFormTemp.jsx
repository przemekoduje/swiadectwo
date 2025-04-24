// src/components/ClientForm.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ClientForm() {
  const [clientPhone, setClientPhone] = useState("");
  const [agentPhone, setAgentPhone] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setAgentPhone(ref);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientPhone || !agentPhone) {
      alert("Podaj numer klienta i upewnij się, że link zawiera ref");
      return;
    }

    try {
      await addDoc(collection(db, "leads_submitted"), {
        agentPhone,
        clientPhone,
        timestamp: serverTimestamp(),
      });

      alert("Zgłoszenie zostało zapisane!");
      setClientPhone("");
    } catch (err) {
      console.error("Błąd zapisu:", err);
      alert("Wystąpił błąd podczas zapisu");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Zgłoszenie klienta</h2>
      <form onSubmit={handleSubmit}>
        <label>Numer telefonu klienta:</label>
        <input
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          required
          placeholder="np. 600123123"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input type="hidden" name="ref" value={agentPhone} />

        <button type="submit" style={{ padding: 10 }}>
          Wyślij
        </button>
      </form>
    </div>
  );
}
