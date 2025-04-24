import React, { useState, useEffect } from "react";
import "./formComponent.scss";

export default function FormComponent({ updateProgress }) {
  const totalFields = 10;
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

  const [tempFormData, setTempFormData] = useState(formData); // Tymczasowy stan

  // Funkcja do aktualizacji stanu w czasie rzeczywistym (tymczasowy stan)
  const handleChange = (e) => {
    setTempFormData({
      ...tempFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Funkcja wywoływana po opuszczeniu pola (onBlur) - aktualizacja faktycznego stanu
  const handleBlur = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: tempFormData[e.target.name],
    });
  };

  useEffect(() => {
    // Obliczanie ilości wypełnionych pól
    const filledFields = Object.values(formData).filter(
      (value) => value !== "" && value !== null && value !== undefined
    ).length;
    // Aktualizacja progressu
    updateProgress(filledFields, totalFields);
  }, [formData, updateProgress]);

  return (
    <div>
      <form className="forms">
        <input
          type="text"
          name="field1"
          value={tempFormData.field1}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 1"
        />
        <input
          type="text"
          name="field2"
          value={tempFormData.field2}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 2"
        />
        <input
          type="text"
          name="field3"
          value={tempFormData.field3}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 3"
        />
        <input
          type="text"
          name="field4"
          value={tempFormData.field4}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 4"
        />
        <input
          type="text"
          name="field5"
          value={tempFormData.field5}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 5"
        />
        <input
          type="text"
          name="field6"
          value={tempFormData.field6}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 6"
        />
        <input
          type="text"
          name="field7"
          value={tempFormData.field7}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 7"
        />
        <input
          type="text"
          name="field8"
          value={tempFormData.field8}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 8"
        />
        <input
          type="text"
          name="field9"
          value={tempFormData.field9}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 9"
        />
        <input
          type="text"
          name="field10"
          value={tempFormData.field10}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Field 10"
        />
      </form>
    </div>
  );
}
