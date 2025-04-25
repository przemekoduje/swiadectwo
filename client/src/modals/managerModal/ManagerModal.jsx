// src/modals/managerModal/ManagerModal.jsx
import React, { useState } from "react";

/**
 * Modal do wprowadzania odpowiedzi otrzymanych od zarządcy.
 *  props:
 *    open       – bool, czy okno jest widoczne
 *    onClose    – funkcja zamykająca
 *    request    – cały dokument cert_request
 *    onSave(id, answers) – zapisuje dane w Firestore (przekazana z AdminPanelu)
 */
export default function ManagerModal({ open, onClose, request, onSave }) {

    console.log("➡️ PROPS w MODALU:", { open, request });
  const [local, setLocal] = useState({});

  if (!open || !request) return null; // nic nie rysuj, gdy zamknięte

  // 🔧 Odbudowa struktury form
  const rebuildFormStructure = (flatData) => {
    const form = {};
    Object.entries(flatData).forEach(([key, value]) => {
      if (key.startsWith("form.")) {
        const [, step, field] = key.split(".");
        if (!form[step]) form[step] = {};
        form[step][field] = value;
      }
    });
    return form;
  };

  

  const form = request?.form || rebuildFormStructure(request || {});
    console.log("🛠️ FORM PO REBUILD:", form);

  

  /* lista braków –– bardzo proste wykrywanie */
  const missing = Object.entries(form ?? {}).flatMap(
    ([stepKey, stepData]) =>
      Object.entries(stepData)
        .filter(([, v]) => v === "" || v === "--Brak informacji")
        .map(([field]) => field)
  );

  console.log("🔍 MODAL FORM:", request.form);
  console.log("❓ MISSING FIELDS:", missing);
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Uzupełnij brakujące dane</h3>

        {missing.length === 0 && <p>Brak pól do uzupełnienia 🎉</p>}

        {missing.map((field) => (
          <div key={field} style={{ marginBottom: 12 }}>
            <label>{field}</label>
            <input
              value={local[field] ?? ""}
              onChange={(e) => setLocal({ ...local, [field]: e.target.value })}
            />
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => {
              onSave(request.id, local);
              onClose();
            }}
            disabled={missing.length === 0}
          >
            Zapisz
          </button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
