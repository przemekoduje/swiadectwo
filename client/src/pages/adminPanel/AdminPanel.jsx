import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import ManagerModal from "../../modals/managerModal/ManagerModal"; // Importuj komponent ManagerModal

const STATUSES = ["DRAFT", "WAIT_MANAGER", "IN_PROGRESS", "DONE"];
const nextStatus = (s) => {
  const idx = STATUSES.indexOf(s);
  return STATUSES[(idx + 1) % STATUSES.length];
};

export default function AdminPanel() {
  const [tab, setTab] = useState("referrals");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);

  const generateLink = async () => {
    if (!phone) return alert("Podaj numer telefonu pośrednika");

    try {
      const refDoc = doc(db, "referrals", phone);
      const existing = await getDoc(refDoc);

      if (!existing.exists()) {
        await setDoc(refDoc, {
          ref: phone,
          createdAt: serverTimestamp(),
          note,
        });
      }

      await addDoc(collection(db, "leads_submitted"), {
        agentPhone: phone,
        clientPhone: null,
        timestamp: serverTimestamp(),
      });

      const link = `${window.location.origin}/wizytowka?ref=${phone}&partner=true`;
      setGeneratedLink(link);
      fetchSubmissions();
    } catch (err) {
      console.error("Błąd zapisu do Firestore:", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "leads_submitted"));
      const results = querySnapshot.docs.map((doc) => doc.data());

      const grouped = results.reduce((acc, curr) => {
        if (!curr.agentPhone) return acc;
        if (!acc[curr.agentPhone]) {
          acc[curr.agentPhone] = [];
        }
        if (curr.clientPhone) {
          acc[curr.agentPhone].push(curr.clientPhone);
        }
        return acc;
      }, {});

      const groupedArray = Object.entries(grouped).map(
        ([agentPhone, clientPhones]) => ({
          agentPhone,
          clientPhones,
        })
      );

      setSubmissions(groupedArray);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "cert_requests")
      // orderBy("timestamps.createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("🔥 Pełne dane dokumentu:", docs); // ← masz je w dobrym formacie!
      setRequests(docs);
    });

    return () => unsub();
  }, []);

  const bumpStatus = async (id, current) => {
    try {
      await updateDoc(doc(db, "cert_requests", id), {
        status: nextStatus(current),
      });
    } catch (err) {
      console.error("Nie mogę zaktualizować statusu:", err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSave = async (id, answers) => {
    try {
      await updateDoc(
        doc(db, "cert_requests", id),
        {
          "managerAnswers.answeredAt": serverTimestamp(),
          "managerAnswers.data": answers,
          status: "IN_PROGRESS",
        },
        { merge: true }
      );
    } catch (err) {
      console.error("❌ Nie udało się zapisać odpowiedzi zarządcy:", err);
    }
  };

  const findMissingFields = (form) => {
    const missing = [];

    if (!form || typeof form !== "object") {
      console.log("❌ FORMULARZ NIEPRAWIDŁOWY:", form);
      return missing;
    }

    console.log("✅ START SPRAWDZANIA FORMULARZA:", form);

    Object.entries(form).forEach(([stepKey, stepData]) => {
      console.log(`➡️  KROK: ${stepKey}`, stepData);

      if (typeof stepData === "object" && stepData !== null) {
        Object.entries(stepData).forEach(([field, value]) => {
          console.log(`🔍 Pole: ${field} = ${value}`);
          if (
            typeof value === "string" &&
            value.includes("--Brak informacji")
          ) {
            missing.push(field);
          }
        });
      }
    });

    console.log("🛑 BRAKI ZNALEZIONE:", missing);
    return missing;
  };

  const rebuildForm = (request) => {
    const form = {};
    Object.entries(request).forEach(([key, value]) => {
      if (key.startsWith("form.step")) {
        const step = key.split(".")[1];
        form[step] = value;
      }
    });
    return form;
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h2>🔐 Panel administratora</h2>

      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setTab("referrals")}>Linki referral</button>{" "}
        <button onClick={() => setTab("requests")}>Zgłoszenia świadectw</button>
      </div>

      {tab === "referrals" && (
        <>
          <label>Numer telefonu pośrednika:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="np. 690000000"
            style={{ width: "100%", padding: 10, margin: "10px 0" }}
          />

          <label>Notatka (opcjonalnie):</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="opis pośrednika lub region"
            style={{ width: "100%", padding: 10, marginBottom: 20 }}
          />

          <button onClick={generateLink} style={{ padding: "10px 20px" }}>
            Generuj link z referencją
          </button>

          {generatedLink && (
            <div style={{ marginTop: 20 }}>
              <strong>Wygenerowany link:</strong>
              <p>
                <a href={generatedLink} target="_blank" rel="noreferrer">
                  {generatedLink}
                </a>
              </p>
            </div>
          )}

          {submissions.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h3>📋 Lista zgłoszeń od klientów pośredników</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Telefon pośrednika</th>
                    <th>Telefony klientów</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.agentPhone}>
                      <td>{sub.agentPhone}</td>
                      <td>
                        {sub.clientPhones?.length
                          ? sub.clientPhones.join(", ")
                          : "Brak zgłoszeń"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "requests" && (
        <>
          <h3>📑 Zgłoszenia świadectw energetycznych</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Klient</th>
                <th>Utworzono</th>
                <th>Braki</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                console.log("📝 RENDERUJĘ REKORD:", r);

                const form = rebuildForm(r);
                console.log("📋 FORMULARZ:", form);

                const missing = findMissingFields(form);
                console.log("❓ BRAKI:", missing);

                return (
                  <tr key={r.id}>
                    <td>{r.id.slice(0, 6)}…</td>
                    <td>{r.status}</td>
                    <td>
                      {form?.step2?.firstName} {form?.step2?.lastName}
                    </td>
                    <td>
                      {r.timestamps?.createdAt?.toDate().toLocaleString()}
                    </td>
                    <td>{missing.join(", ") || "Brak"}</td>
                    <td>
                      <button onClick={() => {
                        console.log("Kliknięto UZUPEŁNIJ, rekord:", r);
                        setSelected(r);
                      }}>Uzupełnij</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <ManagerModal
            open={!!selected}
            request={selected}
            onClose={() => setSelected(null)}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
}
