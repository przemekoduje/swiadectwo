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

/* ────────────────────────────────────────────────────────── */
/* 💡  Statusy zgłoszeń – proste enum                       */
const STATUSES = ["DRAFT", "WAIT_MANAGER", "IN_PROGRESS", "DONE"];
const nextStatus = (s) => {
  const idx = STATUSES.indexOf(s);
  return STATUSES[(idx + 1) % STATUSES.length];
};
/* ────────────────────────────────────────────────────────── */

export default function AdminPanel() {
  /* ====== zakładki ====== */
  const [tab, setTab] = useState("referrals"); // referrals | requests

  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [submissions, setSubmissions] = useState([]);

  /* ====== NOWE – zgłoszenia certyfikatów ====== */
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
      } else {
        console.log("Pośrednik już istnieje, pomijam tworzenie.");
      }

      // Utwórz pusty wpis w leads_submitted (jeśli nie istnieje)
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

      const groupedArray = Object.entries(grouped).map(([agentPhone, clientPhones]) => ({
        agentPhone,
        clientPhones,
      }));

      setSubmissions(groupedArray);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
    }
  };

  /* =========================================================
     2. NASŁUCH KOLEKCJI cert_requests  (autosave formularza)
  ========================================================= */
  useEffect(() => {
    const q = query(
      collection(db, "cert_requests"),
      orderBy("timestamps.createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setRequests(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, []);

  /* status → następny */
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

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h2>🔐 Panel administratora</h2>

      {/* ───── zakładki ───── */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setTab("referrals")}>
          Linki referral
        </button>{" "}
        <button onClick={() => setTab("requests")}>
          Zgłoszenia świadectw
        </button>
      </div>

      {tab === "referrals" && (
        <>
          {/* ====== Formularz generowania linku ====== */}
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

          {/* ====== Tabela leadów ====== */}
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
          {/* ====== tabela cert_requests ====== */}
          <h3>📑 Zgłoszenia świadectw energetycznych</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Klient</th>
                <th>Utworzono</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id.slice(0, 6)}…</td>
                  <td>{r.status}</td>
                  <td>
                    {r.form?.step2Data?.firstName}{" "}
                    {r.form?.step2Data?.lastName}
                  </td>
                  <td>
                    {r.timestamps?.createdAt?.toDate().toLocaleString()}
                  </td>
                  <td>
                    <button onClick={() => bumpStatus(r.id, r.status)}>
                      → {nextStatus(r.status)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
} 
