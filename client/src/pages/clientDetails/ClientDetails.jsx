import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { db } from "../../firebase";
import { deleteField } from "firebase/firestore";

export default function ClientDetails() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({ external: [], plans: [], certs: [] });

  const LABELS = {
    email: "Adres e-mail",
    firstName: "Imię",
    lastName: "Nazwisko",
    phone: "Telefon",
    ulica: "Ulica",
    miasto: "Miasto",
    liczbasciann: "Liczba ścian",
    powierzchnia: "Powierzchnia",
    wysokosc: "Wysokość",
    // dodaj resztę jeśli chcesz
  };

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "cert_requests", id));
      if (snap.exists()) {
        const data = snap.data();
        console.log("📦 Dane z dokumentu:", data);
    
        const reconstructedForm = {};
        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith("form.step")) {
            const stepKey = key.split(".")[1]; // np. "step2"
            reconstructedForm[stepKey] = value;
          }
        });
    
        if (Object.keys(reconstructedForm).length > 0) {
          setFormData(reconstructedForm);
        } else {
          console.warn("❗ Nie znaleziono danych kroków formularza.");
        }
      } else {
        console.warn("❗ Dokument nie istnieje.");
      }
    
      setLoading(false);
    };
    

    const fetchImages = async () => {
      const storage = getStorage();
      const folders = ["external", "plans", "certs"];
      const all = {};

      for (const folder of folders) {
        const folderRef = ref(storage, `${id}/${folder}`);
        try {
          const list = await listAll(folderRef);
          all[folder] = await Promise.all(
            list.items.map((item) => getDownloadURL(item))
          );
        } catch {
          all[folder] = [];
        }
      }
      setImages(all);
    };

    fetchData();
    fetchImages();
  }, [id]);

  const handleChange = (step, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...(prev[step] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const updates = { status: "IN_PROGRESS" };

    // Dodaj usunięcie starego `form`
    updates["form"] = deleteField();

    Object.entries(formData).forEach(([stepKey, stepData]) => {
      updates[`form.${stepKey}`] = stepData;
    });

    console.log("✅ Dane do zapisu:", updates);
  
    await updateDoc(doc(db, "cert_requests", id), updates);
    alert("Dane zostały zapisane.");
  };

  if (loading) return <p>Wczytywanie…</p>;
  if (!formData || typeof formData !== "object")
    return <p>Nie znaleziono danych.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h2>Dane z formularza</h2>

      {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNum) => {
        const stepKey = `step${stepNum}`;
        const stepData = formData[stepKey];
        if (!stepData) return null;

        return (
          <div key={stepKey}>
            <h3>Krok {stepNum}</h3>
            {Object.entries(stepData).map(([field, value]) => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label>
                  <strong>{LABELS[field] || field}:</strong>
                  <input
                    value={value}
                    onChange={(e) =>
                      handleChange(stepKey, field, e.target.value)
                    }
                    style={{ width: "100%", padding: 8, marginTop: 4 }}
                  />
                </label>
              </div>
            ))}
          </div>
        );
      })}

      <h3>Zdjęcia</h3>
      {Object.entries(images).map(([folder, urls]) => (
        <div key={folder} style={{ marginBottom: 24 }}>
          <h4>{folder}</h4>
          {urls.length > 0 ? (
            urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                style={{ width: 200, marginRight: 10, marginBottom: 10 }}
              />
            ))
          ) : (
            <p>Brak zdjęć</p>
          )}
        </div>
      ))}

      <button onClick={handleSave} style={{ padding: "10px 20px" }}>
        Zapisz zmiany
      </button>
    </div>
  );
}
