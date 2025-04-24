import React, { useEffect, useState } from "react";
import "./formComponent2.scss";

export default function FormComponent({ updateProgress }) {
  const totalChars = 100; // Załóżmy, że chcemy policzyć 100 znaków w sumie
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
    field7: "",
    field8: "",
    field9: "",
    field10: "",
  });

  // Funkcja do obsługi zmian w formularzu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Obliczamy łączną liczbę wpisanych znaków
  useEffect(() => {
    const totalFilledChars = Object.values(formData).reduce((acc, fieldValue) => acc + fieldValue.length, 0);
    
    // Aktualizacja postępu na podstawie liczby znaków
    updateProgress(totalFilledChars, totalChars);
  }, [formData, updateProgress]);

  return (
    <div>
      <form className="forms">
        {Object.keys(formData).map((field, index) => (
          <input
            key={index}
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange} // Każda zmiana znaku wprowadza aktualizację
            placeholder={`Field ${index + 1}`}
          />
        ))}
      </form>
    </div>
  );
}
